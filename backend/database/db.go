package database

import (
	"database/sql"
	"log"
	"os"
)

var Db *sql.DB

func Init() {

	var connStr string
	if os.Getenv("RENDER_EXTERNAL_URL") != "" {
		// Render DATABASE_URL
		connStr = os.Getenv("DATABASE_URL")
	} else {
		// Local development
		connStr = "postgresql://postgres:" + os.Getenv("DB_PASSWORD") + "@localhost:8080/postgres?sslmode=disable"
	}
	var err error
	Db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
}
