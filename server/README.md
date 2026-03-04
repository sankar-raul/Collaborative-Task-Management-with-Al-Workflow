# Collaborative Task Management API (Server)

Backend service for collaborative project and task management with role-based access control, JWT authentication, MongoDB persistence, and Socket.IO + Redis for real-time presence.

## Tech Stack

- Node.js + TypeScript
- Express 5
- MongoDB + Mongoose
- Redis
- Socket.IO
- JWT (`jsonwebtoken`)
- Password hashing with `argon2`

## Project Structure

```text
src/
  index.ts                    # app bootstrap, middleware, routes, socket server
  api/
    controllers/              # request handlers
    middleware/               # auth + role checks
    routers/                  # route definitions
  config/                     # env config + DB connection
  constants/                  # roles, task statuses, priorities
  models/                     # Mongoose schemas/models
  redisStore/                 # Redis clients + socket/user mapping helpers
  services/                   # business logic
  types/interface/            # TypeScript interfaces
  utils/security.ts           # JWT + password security helpers
```

## Prerequisites

- Node.js 18+
- MongoDB running and reachable
- Redis running and reachable

## Environment Variables

Create a `.env` file in the server root:

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/collab-task-db
JWT_SECRET=your_jwt_secret
ENVIRONMENT=development
REDIS_SERVER=redis://<host>:6379
```

Notes:
- In development (`ENVIRONMENT=development`), Redis defaults to `redis://127.0.0.1:6379`.
- In non-development, `REDIS_SERVER` is used.

## Install & Run

```bash
yarn
yarn dev
```

Build and run production:

```bash
yarn build
yarn start
```

## Authentication & Authorization

### Token

- Login/Register returns `auth.access_token`.
- Send token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

### Global auth flow

- `softAuth` runs globally and, when token exists and is valid, sets `req.user`.
- `hardAuth` blocks requests without authenticated user.
- `adminAuth` allows only users with role `Admin`.
- Project and task role middlewares allow:
  - `Admin` always
  - specific project role checks where required (`Manager` for protected task/project mutations).

### Roles

- `Admin`
- `Manager`
- `User`

## API Base URL

`http://localhost:8080`

All routes are prefixed with `/api`.

---

## API Endpoints

Response format generally includes:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Auth

#### `POST /api/auth/register`

Create a user.

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "skills": ["Node.js", "MongoDB"],
  "availabilityHours": 40,
  "currentWorkload": 0
}
```

#### `POST /api/auth/login`

Login user.

Body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Projects (`/api/projects`) 

Requires authentication (`hardAuth`) at router level.

#### `POST /api/projects` *(Admin only)*

Create project.

Body:

```json
{
  "projectName": "Website Revamp",
  "description": "Redesign and migrate frontend",
  "members": [
    { "user": "<userObjectId>", "role": "Manager" },
    { "user": "<userObjectId>", "role": "User" }
  ]
}
```

#### `GET /api/projects` *(Admin only)*

Get all projects (paginated).

Query:
- `page` (default `1`)
- `limit` (default `10`)

#### `GET /api/projects/:id`

Get project by ID (must be project member or admin).

#### `PUT /api/projects/:id`

Update project (Manager of that project or Admin).

#### `DELETE /api/projects/:id` *(Admin only)*

Delete project.

#### `GET /api/projects/:id/count` *(Admin only)*

Get total project count.

#### `POST /api/projects/:id/members`

Add member to project (Manager of that project or Admin).

Body:

```json
{
  "userId": "<userObjectId>",
  "role": "User"
}
```

#### `DELETE /api/projects/:id/members`

Remove member from project (Manager of that project or Admin).

Body:

```json
{
  "userId": "<userObjectId>"
}
```

#### `GET /api/projects/:id/members`

Get project members (project member or admin).

#### `PUT /api/projects/:id/members` *(Admin only)*

Update project member role.

Body:

```json
{
  "userId": "<userObjectId>",
  "role": "Manager"
}
```

---

### Members (`/api/members`)

Requires authentication (`hardAuth`) at router level.

#### `GET /api/members/projects`

Get projects assigned to authenticated user.

#### `GET /api/members/projects/:id/role`

Get authenticated user role in a project.

#### `GET /api/members/all` *(Admin only)*

Get all users (paginated).

Query:
- `page` (default `1`)
- `limit` (default `10`)

---

### Tasks (`/api/tasks`)

Requires authentication (`hardAuth`) at router level.

#### `POST /api/tasks`

Create task (Manager of project or Admin).

Body:

```json
{
  "title": "Implement auth middleware",
  "description": "Add hard auth + role checks",
  "projectId": "<projectObjectId>",
  "requiredSkills": ["TypeScript", "Express"],
  "priority": "High",
  "status": "To Do",
  "assignedTo": "<userObjectId>",
  "deadline": "2026-03-10T23:59:59.000Z"
}
```

#### `GET /api/tasks/overdue` *(Admin only)*

Get overdue tasks.

#### `GET /api/tasks/get-all`

Get all tasks assigned to authenticated user.

#### `GET /api/tasks/project/:projectId`

Get tasks by project ID.

#### `GET /api/tasks/user/:userId`

Get tasks by user ID.

#### `GET /api/tasks/:id`

Get task by ID.

#### `PUT /api/tasks/:id`

Update task (Manager of linked project or Admin).

#### `DELETE /api/tasks/:id`

Delete task (Manager of linked project or Admin).

#### `PUT /api/tasks/:id/status`

Change task status.

Body:

```json
{
  "status": "In Progress"
}
```

#### `PUT /api/tasks/:id/assign`

Assign task to user (Manager of linked project or Admin).

Body:

```json
{
  "userId": "<userObjectId>"
}
```

---

## Socket.IO

Socket server runs on the same HTTP server.

### Connection auth

Client must send JWT in handshake auth:

```js
const socket = io("http://localhost:8080", {
  auth: { token: accessToken }
});
```

If token is missing/invalid, connection is rejected with `unauthorized!`.

### Presence tracking

- On connect, user socket ID is mapped in Redis set `user_id:<userId>`.
- On disconnect, socket ID is removed from that set.
- Helper methods exist for looking up active socket IDs and online/offline status.

## Data Models

### User

- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required, hashed)
- `role` (`Admin` | `Manager` | `User`)
- `skills` (string[])
- `availabilityHours` (number)
- `currentWorkload` (number)

### Project

- `projectName` (string, required)
- `description` (string)
- `members` (array)
  - `user` (ObjectId ref `User`)
  - `role` (`Manager` | `User`)

### Task

- `title` (string, required)
- `description` (string)
- `priority` (`Low` | `Medium` | `High` | `Critical`)
- `requiredSkills` (string[])
- `assignedTo` (ObjectId ref `User`)
- `projectId` (ObjectId ref `Project`, required)
- `status` (`To Do` | `Assigned` | `In Progress` | `In Review` | `Completed`)
- `deadline` (Date)

## Error Handling

- `401` for unauthenticated requests to protected routes.
- `403` for insufficient permissions.
- `404` fallback for unknown routes.
- `500` for unhandled server/service errors.

## Notes for Contributors

- Path aliases use `@/* -> src/*`.
- Express `Request` is extended with `req.user` in `src/global.d.ts`.
- `admin.route.ts` exists but currently has no endpoints.

## Quick Start Flow (Example)

1. Register and login to obtain access token.
2. Create users and ensure one has `Admin` role in database.
3. Create a project as Admin.
4. Add members (`Manager`/`User`) to the project.
5. Create and manage tasks as Manager/Admin.
6. Connect Socket.IO client with JWT for presence tracking.
