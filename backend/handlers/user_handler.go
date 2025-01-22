package handlers

import (
	"database/sql"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"

	"forum-app/backend/database"
	"forum-app/backend/models"
	"forum-app/backend/utils"
)

func Register(c *fiber.Ctx) error {
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
	err := database.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", input.Username).Scan(&exist)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	if exist {
		return c.Status(400).JSON(fiber.Map{"error": "Username already exists"})
	}

	var userID int
	err = database.Db.QueryRow("INSERT INTO users (username) VALUES ($1) RETURNING id", input.Username).Scan(&userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user"})
	}

	//generate jwt
	token := utils.GenerateToken(strconv.Itoa(userID))

	return c.JSON(fiber.Map{
		"token": token,
		"user": models.User{
			ID:       userID,
			Username: input.Username,
		},
	})
}

func Login(c *fiber.Ctx) error {
	var input struct {
		Username string `json:"username"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Find user by username
	var user models.User
	err := database.Db.QueryRow(
		"SELECT *  FROM users WHERE username = $1",
		input.Username,
	).Scan(&user.ID, &user.Username, &user.CreatedAt)

	if err == sql.ErrNoRows {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
	} else if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Database error")
	}

	// Generate JWT
	token := utils.GenerateToken(strconv.Itoa(user.ID))

	return c.JSON(fiber.Map{
		"token":    token,
		"user":     user,
		"login_at": time.Now(),
	})
}
