package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"forum-app/backend/database"
	"forum-app/backend/handlers"
	"forum-app/backend/middleware"
)

func main() {
	//load .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// init database
	database.Init()
	defer database.Db.Close()

	app := fiber.New()

	//set up CORS
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "yappers101.netlify.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	//set up routes
	app.Post("/api/auth/register", handlers.GetThreads)
	app.Post("/api/auth/login", handlers.Login)

	api := app.Group("/api/", middleware.AuthMiddleware)

	api.Get("threads", handlers.GetThreads)
	api.Post("threads", handlers.CreateThreads)
	api.Put("threads/:id", handlers.EditThreads)
	api.Delete("threads/:id", handlers.DeleteThreads)

	api.Get("threads/view/:id", handlers.GetThreadView)
	api.Get("threads/my-threads/:id", handlers.GetMyThreads)
	api.Get("threads/search", handlers.HandleTagSearch)
	api.Get("tags", handlers.GetTags)

	api.Get("threads/comments/:id", handlers.GetComments)
	api.Post("threads/comments/:id", handlers.PostComments)

	port := "3000"
	log.Fatal(app.Listen(":" + port))
}
