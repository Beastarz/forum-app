# Yappers101 Forum App

Hi! I am Goh Jin Yu, NUS Computer Science Y1 student. This is a forum application built with TypeScript and Go with PostgreSQL database.

## Description
This repository contains the source code for a forum application Yapppers101 with the following built:
1. Backend in Go using Fiber, and basic authentication using JWT
2. Frontend with React + TypeScript, with MUI for UI design
3. PostgreSQL database.

### Deployment
1. The backend of application is deployed on Render, with Render's PostgreSQL database which will expire on 18 Feb 2025.
2. The frontend is deployed on Netlify, link: https://yappers101.netlify.app

## Installation

To install and run the this repository locally, follow these steps:

1. Clone this repository
   
### Running the backend
1. Download and install Go by following the instructions [here](https://go.dev/doc/install)
2. Create your PostgreSQL database if you do not have one. Make sure your database do not consist table named `users`, `tags`, `threads`, and `comments` as the program will create and dump sample data into your database.
3. Open your terminal and navigate to the backend directory.
   ```bash
   cd  backend
   ```
4. Navigate to `backend` > `database` > `db.go` and change `connstr` to your database url.
5. Check the imports and dependencies by running this command:
   ```bash
   go mod tidy
   ```
6. Run the backend by entering this command:
   ```bash
   go run main.go
   ```
7. Head to set up frontend to view datas fetch from the database

### Running the frontend

1. Open your terminal and navigate to client directory.
   ```bash
   cd client
   ```
2. Open App.tsx in src folder
3. Change `BASE_URL` to http://localhost:3000 or any localhost that serves your backend if you intended to run the backend locally, otherwise you can use renders backend.
4. Install dependencies for the project by entering this command:
```bash
npm install
```
5. Run the app in development mode by entering this command:
```bash
npm run dev
```
7. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
   
## Usage
To use the forum application, follow these steps:

1. Open your browser and navigate to http://localhost:5173.
2. Register a new username or log in with an existing username.
3. Wait for about 1 minute for the backend server to respond.
4. Create, view, and participate in forum discussions.
