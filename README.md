# Student Skill & Project Tracker (MERN)

A starter capstone project built with MongoDB, Express, React, and Node.js.

## Features in this starter
- React dashboard with summary cards
- Add, view, update, and delete student projects
- Track project status, category, skills, and due date
- REST API with Express
- MongoDB persistence through Mongoose
- Responsive basic styling

## Requirements
- Node.js 18+ (Node.js 20+ recommended)
- MongoDB Community Server locally, or a MongoDB Atlas connection string
- VS Code

## 1. Start the backend
Open a terminal in `server`:

```bash
npm install
```

Copy `.env.example` to `.env`, then set `MONGO_URI`. Start MongoDB before running the server.

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Test `http://localhost:5000/api/health`.

## 2. Start the frontend
Open a second terminal in `client`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## API endpoints
- `GET /api/health` — health check
- `GET /api/projects` — list projects
- `POST /api/projects` — create a project
- `PATCH /api/projects/:id` — update a project
- `DELETE /api/projects/:id` — delete a project

## Important
This is a learning starter, not a production-ready deployment. Authentication, authorization, input validation, tests, and deployment configuration should be added before real-world use. The current API is not multi-user and should only be run locally until access controls are implemented.
