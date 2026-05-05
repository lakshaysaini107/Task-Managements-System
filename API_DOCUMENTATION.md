# API Documentation

Base URL: `http://localhost:5000/api` (development)

All API requests must include the `Content-Type: application/json` header where applicable.

## Authentication Endpoints

### Sign Up
**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing fields (name, email, password required)
- 409: Email already in use
- 500: Server error

---

### Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials
- 500: Server error

---

### Get Profile
**Endpoint:** `GET /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: Missing or invalid token
- 500: Server error

---

## Project Endpoints

### Create Project
**Endpoint:** `POST /projects`

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Q4 Product Launch",
  "description": "Managing the Q4 product launch timeline"
}
```

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "name": "Q4 Product Launch",
    "description": "Managing the Q4 product launch timeline",
    "admin_id": 1,
    "admin": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "tasks": []
  }
}
```

**Errors:**
- 400: Project name required
- 401: Unauthorized (token missing)
- 500: Server error

---

### Get All Projects
**Endpoint:** `GET /projects`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Q4 Product Launch",
      "description": "Managing the Q4 product launch timeline",
      "admin_id": 1,
      "admin": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [...],
      "tasks": [...]
    }
  ]
}
```

---

### Get Project by ID
**Endpoint:** `GET /projects/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "project": {
    "id": 1,
    "name": "Q4 Product Launch",
    "description": "Managing the Q4 product launch timeline",
    "admin_id": 1,
    "admin": {...},
    "members": [...],
    "tasks": [...]
  }
}
```

**Errors:**
- 403: User is not a member of project
- 404: Project not found
- 401: Unauthorized

---

### Add Member to Project
**Endpoint:** `POST /projects/:id/members`

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "userId": 2
}
```

**Response (201):**
```json
{
  "message": "Member added successfully",
  "member": {
    "id": 2,
    "user": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  }
}
```

**Errors:**
- 400: User ID required or user not a project member
- 403: Only admin can add members
- 404: Project or user not found
- 409: User already a member
- 401: Unauthorized

---

### Remove Member from Project
**Endpoint:** `DELETE /projects/:id/members/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Member removed successfully"
}
```

**Errors:**
- 403: Only admin can remove members
- 404: Project or member not found
- 401: Unauthorized

---

## Task Endpoints

### Create Task
**Endpoint:** `POST /tasks/:projectId/tasks`

**Headers:** `Authorization: Bearer <token>`

**Required:** Admin of project

**Request:**
```json
{
  "title": "Design homepage mockups",
  "description": "Create high-fidelity mockups for new homepage design",
  "dueDate": "2024-12-15",
  "priority": "High",
  "assignedTo": 2
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "title": "Design homepage mockups",
    "description": "Create high-fidelity mockups for new homepage design",
    "dueDate": "2024-12-15T00:00:00.000Z",
    "priority": "High",
    "status": "To Do",
    "assignedTo": 2,
    "projectId": 1,
    "assignee": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  }
}
```

**Errors:**
- 400: Title required, assignee not a member
- 403: Only admin can create tasks
- 404: Project not found
- 401: Unauthorized

---

### Get Tasks by Project
**Endpoint:** `GET /tasks/:projectId/tasks`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design homepage mockups",
      "description": "...",
      "dueDate": "2024-12-15T00:00:00.000Z",
      "priority": "High",
      "status": "In Progress",
      "assignedTo": 2,
      "projectId": 1,
      "assignee": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ]
}
```

**Errors:**
- 403: User is not a member of project
- 404: Project not found
- 401: Unauthorized

---

### Update Task
**Endpoint:** `PUT /tasks/task/:id`

**Headers:** `Authorization: Bearer <token>`

**Permissions:**
- Admin: Can update all fields
- Task assignee: Can only update status
- Other members: Cannot update

**Request (Admin - Full update):**
```json
{
  "title": "Design homepage mockups (Updated)",
  "description": "Updated description",
  "dueDate": "2024-12-20",
  "priority": "Critical",
  "status": "In Progress",
  "assignedTo": 3
}
```

**Request (Member - Status only):**
```json
{
  "status": "Done"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Design homepage mockups (Updated)",
    "description": "Updated description",
    "dueDate": "2024-12-20T00:00:00.000Z",
    "priority": "Critical",
    "status": "Done",
    "assignedTo": 3,
    "projectId": 1,
    "assignee": {...}
  }
}
```

**Errors:**
- 400: Invalid assignee (not a member)
- 403: Insufficient permissions to update task
- 404: Task not found
- 401: Unauthorized

---

### Delete Task
**Endpoint:** `DELETE /tasks/task/:id`

**Headers:** `Authorization: Bearer <token>`

**Required:** Admin of project

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- 403: Only admin can delete tasks
- 404: Task not found
- 401: Unauthorized

---

## Dashboard Endpoints

### Get Dashboard Stats
**Endpoint:** `GET /dashboard`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "totalTasks": 15,
  "tasksByStatus": {
    "To Do": 5,
    "In Progress": 7,
    "Done": 3
  },
  "tasksByUser": [
    {
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "count": 8
    },
    {
      "user": {
        "id": 3,
        "name": "Bob Johnson",
        "email": "bob@example.com"
      },
      "count": 5
    }
  ],
  "overdueTasks": [
    {
      "id": 5,
      "title": "An old task",
      "description": "...",
      "dueDate": "2024-11-20T00:00:00.000Z",
      "priority": "High",
      "status": "In Progress",
      "projectId": 1,
      "assignee": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "project": {
        "id": 1,
        "name": "Q4 Product Launch"
      }
    }
  ]
}
```

**Notes:**
- Only returns data for projects user is a member of
- Overdue = due date before today AND status != Done
- Returns empty data if user has no projects

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal server error |

---

## Request Headers

All authenticated requests require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Priority Levels

- `Low` - Low priority (default is Medium)
- `Medium` - Standard priority
- `High` - High priority/urgent

---

## Task Status

- `To Do` - Task not yet started
- `In Progress` - Task currently being worked on
- `Done` - Task completed

---

## Token Format

JWT tokens expire in 7 days. Format: `Bearer <token>`

Example token structure (decoded):
```json
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1235173690
}
```

---

## Rate Limiting

No rate limiting implemented in base version. Recommended for production deployment.

---

## CORS

Frontend URL must be whitelisted in backend CORS configuration. Default CORS is open for development.

---

## Best Practices

1. Always include Authorization header for protected endpoints
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. Check response status before processing data
4. Refresh token if you receive 401 error
5. Validate input on frontend before sending
6. Handle errors gracefully in frontend
7. Store token securely (localStorage is acceptable for this app)
8. Never expose JWT_SECRET in frontend
