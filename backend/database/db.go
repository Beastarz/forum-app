package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

var Db *sql.DB

func Init() {

	var connStr string
	if os.Getenv("RENDER_EXTERNAL_URL") != "" {
		// Render DATABASE_URL
		connStr = os.Getenv("DATABASE_URL")
		fmt.Println("connect to render database")
	} else {
		// Local development
		connStr = "postgresql://postgres:" + os.Getenv("DB_PASSWORD") + "@localhost:8080/postgres?sslmode=disable"
		fmt.Println("connect to local database")
	}
	var err error
	Db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = setupDatabase(Db); err != nil {
		log.Fatal(err)
	}

}

func setupDatabase(db *sql.DB) error {
	// Check if tables exist
	var exists bool
	err := db.QueryRow(`
		SELECT EXISTS (
			SELECT FROM information_schema.tables 
			WHERE table_name = 'users'
		)`).Scan(&exists)
	if err != nil {
		log.Fatalf("error checking tables: %v", err)
	}

	// If tables don't exist, create them and add sample data
	if !exists {
		setupQuery := `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(255) NOT NULL UNIQUE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS tags (
			id SERIAL PRIMARY KEY,
			tag VARCHAR(50) NOT NULL UNIQUE
		);

		CREATE TABLE IF NOT EXISTS threads (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			author_id INTEGER REFERENCES users(id),
			author VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			tag VARCHAR(50) REFERENCES tags(tag)
		);

		CREATE TABLE IF NOT EXISTS comments (
			id SERIAL PRIMARY KEY,
			thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
			content TEXT NOT NULL,
			author_id INTEGER REFERENCES users(id),
			author VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		-- Insert sample data
		INSERT INTO users (username) VALUES
		('amos_lee'),
		('jane_tan'),
		('bob_choi');

		INSERT INTO tags (tag) VALUES
		('romance'),
		('studies'),
		('life'),
		('school'),
		('food'),
		('others');

		INSERT INTO threads (title, content, author_id, author, tag) VALUES
		('Welcome to the Forum', 'This is our first thread!', 1, 'amos_lee', 'others'),
		('Finding my way to COM', 'How do I go to COM3 MPH?', 2, 'jane_tan', 'school'),
		('CS life', 'What''s everyone working in CS2040S?', 3, 'bob_choi', 'studies');

		INSERT INTO comments (thread_id, content, author_id, author) VALUES
		(1, 'Great to be here!', 2, 'jane_tan'),
		(1, 'Thanks for having us', 3, 'bob_choi'),
		(2, 'Have you checked the NUSMod?', 1, 'amos_lee');`

		_, err = db.Exec(setupQuery)
		if err != nil {
			log.Fatalf("error setting up database: %v", err)
		}
	}

	return nil
}
