package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Thread struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	AuthorID  int       `json:"author_id"`
	Author    string    `json:"author"`
	CreatedAt time.Time `json:"created_at"`
	Tag       string    `json:"tag"`
}

type User struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	CreatedAt string `json:"created_at"`
}

type Comment struct {
	ID        int       `json:"id"`
	ThreadID  int       `json:"thread_id"`
	Content   string    `json:"content"`
	AuthorID  int       `json:"author_id"`
	Author    string    `json:"author"`
	CreatedAt time.Time `json:"created_at"`
}

type Tag struct {
	ID  int    `json:"id"`
	Tag string `json:"tag"`
}

type ThreadView struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Author    string    `json:"author"`
	AuthorID  int       `json:"author_id"`
	CreatedAt time.Time `json:"created_at"`
	Tag       string    `json:"tag"`
	Comments  []Comment `json:"comments"`
}

var db *sql.DB

func main() {
	fmt.Print("hello world")

	connStr := "postgresql://postgres:Trb2019.@localhost:8080/postgres?sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	app := fiber.New()

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))
	app.Post("/api/auth/register", register)
	app.Post("/api/auth/login", login)

	api := app.Group("/api/", authMiddleware)

	api.Get("threads", getThreads)
	api.Post("threads", createThreads)
	// api.Put("threads/:id", updateThreads)
	api.Delete("threads/:id", deleteThreads)

	api.Get("threads/view/:id", getThreadView)
	api.Get("threads/my-threads/:id", getMyThreads)
	api.Get("threads/search", handleTagSearch)
	api.Get("tags", getTags)

	api.Get("threads/comments/:id", getComments)
	api.Post("threads/comments/:id", postComments)

	port := "3000"
	log.Fatal(app.Listen(":" + port))
}

func authMiddleware(c *fiber.Ctx) error {
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Missing authorization header"})
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["userID"].(string)
		c.Locals("userID", userID)

		return c.Next()
	}

	return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
}

func generateToken(userID string) string {
	claims := jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	return tokenString
}

func register(c *fiber.Ctx) error {
	var input struct {
		Username string `json:"username"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	if input.Username == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username is required"})
	}

	var exist bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", input.Username).Scan(&exist)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	if exist {
		return c.Status(400).JSON(fiber.Map{"error": "Username already exists"})
	}

	var userID int
	err = db.QueryRow("INSERT INTO users (username) VALUES ($1) RETURNING id", input.Username).Scan(&userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user"})
	}

	//generate jwt
	token := generateToken(strconv.Itoa(userID))

	return c.JSON(fiber.Map{
		"token": token,
		"user": User{
			ID:       userID,
			Username: input.Username,
		},
	})
}

func login(c *fiber.Ctx) error {
	var input struct {
		Username string `json:"username"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Find user by username
	var user User
	err := db.QueryRow(
		"SELECT *  FROM users WHERE username = $1",
		input.Username,
	).Scan(&user.ID, &user.CreatedAt, &user.Username)

	if err == sql.ErrNoRows {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
	} else if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Database error")
	}

	// Generate JWT
	token := generateToken(strconv.Itoa(user.ID))

	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}

func getThreads(c *fiber.Ctx) error {
	var threads []Thread
	rows, err := db.Query(`SELECT * FROM threads
				ORDER BY created_at DESC`)
	if err != nil {
		return err
	}

	defer rows.Close()

	for rows.Next() {
		var thread Thread
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.CreatedAt,
			&thread.AuthorID,
			&thread.Author,
			&thread.Tag,
		)
		if err != nil {
			return err
		}
		threads = append(threads, thread)
	}
	return c.JSON(threads)

}

func createThreads(c *fiber.Ctx) error {
	thread := new(Thread)
	if err := c.BodyParser(thread); err != nil {
		return err
	}

	if thread.Title == "" {
		return c.Status(400).SendString("Title is required")
	}
	if thread.Content == "" {
		return c.Status(400).SendString("Content is required")
	}
	if thread.Tag == "" {
		return c.Status(400).SendString("Tag is required")
	}

	rows, err := db.Query(`SELECT id FROM users WHERE username = $1`, thread.Author)
	if err != nil {
		return err
	}
	for rows.Next() {
		err = rows.Scan(&thread.AuthorID)
		if err != nil {
			return err
		}
	}
	err = db.QueryRow(`INSERT INTO threads (title, content, author_id, author, created_at, tag)
			VALUES ($1,$2,$3,$4, NOW(), $5)
			RETURNING id, created_at`,
		thread.Title, thread.Content, thread.AuthorID, thread.Author, thread.Tag).Scan(&thread.ID, &thread.CreatedAt)
	if err != nil {
		return err
	}
	return c.Status(201).JSON(thread)
}

func deleteThreads(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	result, err := db.Exec(`DELETE FROM threads WHERE id = $1`, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "thread not found"})
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func getThreadView(c *fiber.Ctx) error {
	var threadView ThreadView
	var comments []Comment

	//get id
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	//get thread data
	rows, err := db.Query(`SELECT * FROM threads WHERE id = $1`, id)
	if err != nil {
		return err
	}

	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(&threadView.ID, &threadView.Title, &threadView.Content,
			&threadView.CreatedAt, &threadView.AuthorID, &threadView.Author, &threadView.Tag)
		if err != nil {
			return err
		}
	}

	//get comments
	rows, err = db.Query(`SELECT * FROM comments WHERE thread_id = $1 `, id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var comment Comment
		err := rows.Scan(
			&comment.ID,
			&comment.ThreadID,
			&comment.Content,
			&comment.AuthorID,
			&comment.CreatedAt,
			&comment.Author,
		)
		if err != nil {
			return err
		}
		comments = append(comments, comment)
	}
	threadView.Comments = comments
	return c.Status(200).JSON(threadView)
}

func getMyThreads(c *fiber.Ctx) error {
	var threads []Thread
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	rows, err := db.Query(`SELECT * FROM threads WHERE author_id = $1 
							ORDER BY created_at DESC`, id)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var thread Thread
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.CreatedAt,
			&thread.AuthorID,
			&thread.Author,
			&thread.Tag,
		)
		if err != nil {
			return err
		}
		threads = append(threads, thread)
	}
	return c.JSON(threads)
}

func handleTagSearch(c *fiber.Ctx) error {
	var threads []Thread
	tag := c.Query("tag")
	rows, err := db.Query(`SELECT * FROM threads WHERE tag= $1 ORDER BY created_at DESC`, tag)
	if err != nil {
		return err
	}
	for rows.Next() {
		var thread Thread
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.CreatedAt,
			&thread.AuthorID,
			&thread.Author,
			&thread.Tag,
		)
		if err != nil {
			return err
		}
		threads = append(threads, thread)
	}
	return c.Status(200).JSON(threads)
}

func getTags(c *fiber.Ctx) error {
	var tags []Tag
	rows, err := db.Query(`SELECT * FROM TAGS`)
	if err != nil {
		return err
	}
	for rows.Next() {
		var tag Tag
		err := rows.Scan(&tag.ID, &tag.Tag)
		if err != nil {
			return err
		}
		tags = append(tags, tag)
	}
	return c.JSON(tags)
}

func getComments(c *fiber.Ctx) error {
	var comments []Comment
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	rows, err := db.Query(`SELECT * FROM comments WHERE thread_id = $1 
						ORDER BY created_at DESC`, id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var comment Comment
		err := rows.Scan(
			&comment.ID,
			&comment.ThreadID,
			&comment.Content,
			&comment.AuthorID,
			&comment.CreatedAt,
			&comment.Author,
		)
		if err != nil {
			return err
		}
		comments = append(comments, comment)
	}
	return c.JSON(comments)
}

func postComments(c *fiber.Ctx) error {
	comment := new(Comment)

	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	if err := c.BodyParser(comment); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}
	if comment.Content == "" {
		return c.Status(400).JSON(fiber.Map{"error": "content is required"})
	}
	err = db.QueryRow(`INSERT INTO comments (thread_id, content, author_id, author, created_at)
			VALUES ($1,$2,$3,$4, NOW())
			RETURNING id, created_at`,
		id, comment.Content, comment.AuthorID, comment.Author).Scan(&comment.ID, &comment.CreatedAt)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create comment"})
	}
	return c.Status(201).JSON(comment)

}
