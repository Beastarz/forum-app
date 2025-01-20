package models

import "time"

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
