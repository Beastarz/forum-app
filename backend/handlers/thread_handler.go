package handlers

import (
	"github.com/gofiber/fiber/v2"

	"forum-app/backend/database"
	"forum-app/backend/models"
)

func GetThreads(c *fiber.Ctx) error {
	var threads []models.Thread
	rows, err := database.Db.Query(`SELECT * FROM threads
				ORDER BY created_at DESC`)
	if err != nil {
		return err
	}

	defer rows.Close()

	for rows.Next() {
		var thread models.Thread
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.AuthorID,
			&thread.Author,
			&thread.CreatedAt,
			&thread.Tag,
		)
		if err != nil {
			return err
		}
		threads = append(threads, thread)
	}
	return c.JSON(threads)

}

func CreateThreads(c *fiber.Ctx) error {
	thread := new(models.Thread)
	if err := c.BodyParser(thread); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if thread.Title == "" {
		return c.Status(400).SendString("Title is required")
	}
	if thread.Content == "" {
		return c.Status(400).SendString("Content is required")
	}
	if thread.Tag == "" {
		return c.Status(400).SendString("models.Tag is required")
	}

	rows, err := database.Db.Query(`SELECT id FROM users WHERE username = $1`, thread.Author)
	if err != nil {
		return err
	}
	for rows.Next() {
		err = rows.Scan(&thread.AuthorID)
		if err != nil {
			return err
		}
	}
	err = database.Db.QueryRow(`INSERT INTO threads (title, content, author_id, author, created_at, tag)
			VALUES ($1,$2,$3,$4, NOW(), $5)
			RETURNING id, created_at`,
		thread.Title, thread.Content, thread.AuthorID, thread.Author, thread.Tag).Scan(&thread.ID, &thread.CreatedAt)
	if err != nil {
		return err
	}
	return c.Status(201).JSON(thread)
}

func EditThreads(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	editedThread := new(models.Thread)
	if err = c.BodyParser(editedThread); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}
	if editedThread.Title == "" {
		return c.Status(400).SendString("Title is required")
	}
	if editedThread.Content == "" {
		return c.Status(400).SendString("Content is required")
	}
	if editedThread.Tag == "" {
		return c.Status(400).SendString("models.Tag is required")
	}

	editedThread.ID = id
	err = database.Db.QueryRow(`UPDATE threads
			set title = $1 , content = $2 , tag = $3
			WHERE id = $4 RETURNING author, author_id , created_at`,
		editedThread.Title, editedThread.Content, editedThread.Tag,
		editedThread.ID).Scan(&editedThread.Author, &editedThread.AuthorID, &editedThread.CreatedAt)
	if err != nil {
		return err
	}
	return c.Status(201).JSON(editedThread)
}

func DeleteThreads(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	result, err := database.Db.Exec(`DELETE FROM threads WHERE id = $1`, id)
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

func GetThreadView(c *fiber.Ctx) error {
	var threadView models.ThreadView
	var comments []models.Comment

	//get id
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	//get thread data
	rows, err := database.Db.Query(`SELECT * FROM threads WHERE id = $1`, id)
	if err != nil {
		return err
	}

	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(
			&threadView.ID,
			&threadView.Title,
			&threadView.Content,
			&threadView.AuthorID,
			&threadView.Author,
			&threadView.CreatedAt,
			&threadView.Tag,
		)
		if err != nil {
			return err
		}
	}

	//get comments
	rows, err = database.Db.Query(`SELECT * FROM comments WHERE thread_id = $1 `, id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(
			&comment.ID,
			&comment.ThreadID,
			&comment.Content,
			&comment.AuthorID,
			&comment.Author,
			&comment.CreatedAt,
		)
		if err != nil {
			return err
		}
		comments = append(comments, comment)
	}
	threadView.Comments = comments
	return c.Status(200).JSON(threadView)
}

func GetMyThreads(c *fiber.Ctx) error {
	var threads []models.Thread
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	rows, err := database.Db.Query(`SELECT * FROM threads WHERE author_id = $1 
							ORDER BY created_at DESC`, id)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var thread models.Thread
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.AuthorID,
			&thread.Author,
			&thread.CreatedAt,
			&thread.Tag,
		)
		if err != nil {
			return err
		}
		threads = append(threads, thread)
	}
	return c.JSON(threads)
}

func HandleTagSearch(c *fiber.Ctx) error {
	var threads []models.Thread
	tag := c.Query("tag")
	rows, err := database.Db.Query(`SELECT * FROM threads WHERE tag= $1 ORDER BY created_at DESC`, tag)
	if err != nil {
		return err
	}
	for rows.Next() {
		var thread models.Thread
		err := rows.Scan(
			&thread.ID,
			&thread.Title,
			&thread.Content,
			&thread.AuthorID,
			&thread.Author,
			&thread.CreatedAt,
			&thread.Tag,
		)
		if err != nil {
			return err
		}
		threads = append(threads, thread)
	}
	return c.Status(200).JSON(threads)
}

func GetTags(c *fiber.Ctx) error {
	var tags []models.Tag
	rows, err := database.Db.Query(`SELECT * FROM TAGS`)
	if err != nil {
		return err
	}
	for rows.Next() {
		var tag models.Tag
		err := rows.Scan(&tag.ID, &tag.Tag)
		if err != nil {
			return err
		}
		tags = append(tags, tag)
	}
	return c.JSON(tags)
}

func GetComments(c *fiber.Ctx) error {
	var comments []models.Comment
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	rows, err := database.Db.Query(`SELECT * FROM comments WHERE thread_id = $1 
						ORDER BY created_at DESC`, id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(
			&comment.ID,
			&comment.ThreadID,
			&comment.Content,
			&comment.AuthorID,
			&comment.Author,
			&comment.CreatedAt,
		)
		if err != nil {
			return err
		}
		comments = append(comments, comment)
	}
	return c.JSON(comments)
}

func PostComments(c *fiber.Ctx) error {
	comment := new(models.Comment)

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
	err = database.Db.QueryRow(`INSERT INTO comments (thread_id, content, author_id, author, created_at)
			VALUES ($1,$2,$3,$4, NOW())
			RETURNING id, created_at`,
		id, comment.Content, comment.AuthorID, comment.Author).Scan(&comment.ID, &comment.CreatedAt)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create comment"})
	}
	return c.Status(201).JSON(comment)

}
