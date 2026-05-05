# Team Task Manager

A production-ready full-stack web application for team task management built with Node.js, Express, PostgreSQL, React, and Vite.

## Features

✅ **Authentication**
- Secure signup and login with bcrypt password hashing
- JWT-based authentication
- Token stored in localStorage with automatic refresh on 401 errors

✅ **Project Management**
- Create and manage projects
- Admin-based access control
- Add/remove team members from projects

✅ **Task Management**
- Create, assign, update, and delete tasks
- Three-level priority system (Low, Medium, High)
- Task status tracking (To Do, In Progress, Done)
- Due date management and overdue detection
- Role-based task access (Admin full control, Members update own status)

✅ **Dashboard**
- Visual overview of all tasks
- Tasks grouped by status
- Team member workload distribution
- Overdue tasks highlight
- Real-time statistics

✅ **Role-Based Access Control**
- Project admin can manage members and tasks
- Team members have restricted permissions
- Task update restrictions based on assignment

## Tech Stack

**Backend:**
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- JWT Authentication with jsonwebtoken
- Password hashing with bcryptjs
- CORS enabled for frontend communication

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management
- Pure CSS (inline styles)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── TaskBoard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm or yarn
- PostgreSQL database (local or cloud)
- Git for version control

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager_db"
JWT_SECRET="your_super_secret_jwt_key_change_in_production"
PORT=5000
NODE_ENV="development"
```

4. **Setup Prisma and database:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start the server:**
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (in new terminal):**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Start the development server:**
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

5. **Access the application:**
Open your browser and go to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile

### Projects
- `POST /api/projects` - Create new project
- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get specific project details
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Tasks
- `POST /api/tasks/:projectId/tasks` - Create task (admin only)
- `GET /api/tasks/:projectId/tasks` - Get tasks for project
- `PUT /api/tasks/task/:id` - Update task
- `DELETE /api/tasks/task/:id` - Delete task (admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Deployment on Railway

### Backend Deployment

1. **Create Railway project:**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add PostgreSQL plugin:**
   - In Railway dashboard, click "Add"
   - Select "PostgreSQL"
   - The `DATABASE_URL` will be automatically set

3. **Set environment variables:**
   - Go to Variables section
   - Add `JWT_SECRET` with a strong value
   - Add `NODE_ENV=production`

4. **Deploy:**
   - The backend will automatically deploy on push to main branch

5. **Get backend URL:**
   - The Railway-generated URL will be your `BACKEND_URL`

### Frontend Deployment

1. **Create new Railway project for frontend**

2. **Set environment variables:**
   - `VITE_API_URL=<your_backend_railway_url>/api`

3. **Deploy:**
   - Push to GitHub
   - Railway will automatically deploy

## Testing the Application

1. **Sign up:** Create a new account with email and password
2. **Create project:** From Projects page, create a new project
3. **Add members:** Use the Members button in project to add team members
4. **Create tasks:** Add tasks with title, description, priority, and due date
5. **Assign tasks:** Assign tasks to team members
6. **Track progress:** Update task status and monitor in dashboard
7. **View overdue:** Dashboard shows all overdue tasks

## Key Features Explanation

### Role-Based Access Control
- **Admin:** Can create/delete projects, add members, create/update/delete all tasks
- **Member:** Can only update status of assigned tasks, view project data

### Task Authorization
- Only project admin can create and delete tasks
- Task assignee can update task status
- Admin can always update any task detail
- Non-admin, non-assignee users cannot modify tasks

### Dashboard Analytics
- **Total Tasks:** Count of all tasks across user's projects
- **By Status:** Breakdown of tasks in each status
- **By User:** How many tasks each team member has
- **Overdue:** All incomplete tasks past their due date

## Password Security

Passwords are hashed using bcryptjs with 10 salt rounds before storing in database. Never send or store passwords in plain text.

## Error Handling

All endpoints include comprehensive error handling:
- Input validation
- Authentication checks
- Authorization checks
- Proper HTTP status codes
- Descriptive error messages

## Database Relations

```
User
├── adminProjects (Project)
├── projectMembers (ProjectMember)
└── assignedTasks (Task)

Project
├── admin (User)
├── members (ProjectMember)
└── tasks (Task)

ProjectMember
├── user (User)
└── project (Project)

Task
├── assignee (User)
└── project (Project)
```

## Security Best Practices

✅ Use environment variables for secrets
✅ Hash passwords with bcryptjs
✅ Use JWT for stateless auth
✅ Validate all inputs
✅ Implement CORS properly
✅ Check user permissions before operations
✅ Use HTTPS in production
✅ Never commit .env files

## Development Tips

- Use `npm run dev` for both backend and frontend for hot-reload
- Check Prisma Studio: `npm run prisma:studio` to view database
- Test API endpoints with Postman/Insomnia
- Use browser dev tools to inspect localStorage tokens
- Check browser console for Axios interceptor logs

## Troubleshooting

**Port already in use:**
```bash
# Backend
lsof -i :5000  # Find process
kill -9 <PID>  # Kill process

# Frontend
lsof -i :3000
```

**Database connection failed:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Run `npm run prisma:migrate` to apply migrations

**CORS errors:**
- Ensure backend has `cors()` middleware enabled
- Check VITE_API_URL matches backend address
- No HTTPS/HTTP protocol mismatch

**401 Unauthorized:**
- Clear localStorage: `localStorage.clear()`
- Sign in again
- Check JWT_SECRET matches

## License

MIT

## Support

For issues and questions, check the API documentation or review the source code comments.
