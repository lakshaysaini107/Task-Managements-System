# Detailed Setup Guide

Complete step-by-step instructions for setting up and running the Team Task Manager application locally.

## System Requirements

- **Node.js:** v16 or higher
- **npm:** v8 or higher
- **PostgreSQL:** v12 or higher
- **Git:** Latest version
- **RAM:** 2GB minimum
- **Disk Space:** 1GB free

## Installation Steps

### Option 1: Using PostgreSQL Locally (Recommended for Development)

#### Step 1: Set Up PostgreSQL Database

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and follow setup wizard
3. Remember the password for postgres user
4. Ensure PostgreSQL service is running

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE task_manager_db;
\q
```

Or use pgAdmin (GUI tool included with PostgreSQL):
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `task_manager_db`
4. Click "Save"

### Step 2: Clone Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/task_manager_db"
# JWT_SECRET="your_super_secret_key"
# PORT=5000
# NODE_ENV=development
```

Edit `.env`:
```bash
# Use your favorite editor (VS Code, vim, nano, etc.)
code .env  # VS Code
# or
nano .env  # Nano
```

#### Initialize Prisma

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

#### Start Backend Server

```bash
npm run dev
```

You should see:
```
✓ Database connected
✓ Server running on port 5000
```

**Test backend:**
```bash
curl http://localhost:5000/health
# Should return: {"message":"Server is running"}
```

### Step 4: Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The .env already has correct localhost address
# VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Server

```bash
npm run dev
```

You should see something like:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://127.0.0.1:3000/
  ➜  press h to show help
```

### Step 5: Access Application

1. Open browser and navigate to `http://localhost:3000`
2. Should redirect to login page

## First-Time Testing

### Create Test Account

1. Click "Sign Up"
2. Enter:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
3. Click "Sign Up"
4. Should be redirected to Dashboard

### Create Test Project

1. Click "Projects" in navbar
2. Click "+ New Project"
3. Fill in:
   - Name: `My First Project`
   - Description: `Testing the app`
4. Click "Create Project"
5. Should see project card with "View Project" button

### Create Test Tasks

1. Click "View Project"
2. Click "+ New Task" (if you're the admin)
3. Fill in:
   - Title: `Sample Task`
   - Priority: `High`
   - Due Date: Pick a date
4. Click "Create Task"
5. Test status updates by clicking status dropdown

### Check Dashboard

1. Click "Dashboard" in navbar
2. Should see:
   - Total tasks count
   - Tasks grouped by status
   - Overdue tasks (if any)

## Database Management

### View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

Opens web interface to view and edit database data.

### Run Database Migrations

```bash
cd backend

# Create new migration
npm run prisma:migrate -- --name migration_name

# Apply pending migrations
npm run prisma:migrate

# View migration status
npx prisma migrate status
```

### Reset Database (Warning: Deletes all data)

```bash
cd backend
npx prisma migrate reset
```

## Common Development Commands

### Backend

```bash
cd backend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database with Prisma Studio
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate -- --name migration_name

# Apply migrations
npm run prisma:migrate

# Push schema to database
npm run prisma:push
```

### Frontend

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Login with Test Accounts

After first setup, you can create multiple test accounts:

```
Account 1:
Email: user1@example.com
Password: Password123

Account 2:
Email: user2@example.com
Password: Password123

Account 3:
Email: admin@example.com
Password: Password123
```

Use different accounts to test:
- Adding members to projects
- Role-based access control
- Task assignment between users

## Debugging

### View Backend Logs

Terminal output shows:
- Request logs (with Express)
- Database operations
- Errors with stack traces

### View Frontend Errors

1. Open browser DevTools: F12 or Right-click → "Inspect"
2. Console tab shows:
   - JavaScript errors
   - API call logs
   - localStorage contents

### Check Database

```bash
# Connect to database
psql -U postgres -d task_manager_db

# View all tables
\dt

# View table contents
SELECT * FROM "User";
SELECT * FROM "Project";
SELECT * FROM "Task";

# Exit
\q
```

### Prisma Studio

```bash
cd backend
npm run prisma:studio
```

Opens `http://localhost:5555` with visual database browser.

## Troubleshooting

### "Port 5000 already in use"

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### "Database connection failed"

1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env matches credentials
3. Test connection:
   ```bash
   psql -U postgres -h localhost -d task_manager_db
   ```
4. Run migrations: `npm run prisma:migrate`

### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Cannot find module @prisma/client"

```bash
cd backend
npm run prisma:generate
```

### CORS errors (Frontend → Backend)

1. Verify backend is running on port 5000
2. Check `.env` in frontend has correct `VITE_API_URL`
3. Ensure backend `app.js` includes `cors()` middleware
4. Clear browser cache and localStorage

### "Invalid credentials" on login

1. Ensure you signed up with exact email/password
2. Check email is correct case (emails are case-insensitive in DB)
3. Try signing up with new account
4. Check browser console for validation errors

### Tasks not showing after creation

1. Verify you're project admin
2. Refresh page (F5)
3. Check browser console for errors
4. Verify task was created in Prisma Studio

### 401 Unauthorized errors

1. Token may be expired (7 day expiry)
2. Clear localStorage: `localStorage.clear()` in DevTools
3. Sign in again
4. Verify JWT_SECRET is consistent

## Performance Tips

### Development

- Use `npm run dev` for hot-reload instead of restart
- Keep browser DevTools open to catch errors
- Use Prisma Studio to inspect DB state
- Check network tab for API response times

### Frontend Optimization

- Component lazy loading (available for production)
- CSS optimizations
- Asset compression with Vite

### Backend Optimization

- Database query optimization visible in Prisma Studio
- Implement caching for repeated queries
- Use pagination for large datasets

## Environment Variables Reference

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager_db
JWT_SECRET=dev-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## File Structure

```
task-manager/
├── backend/
│   ├── src/              # Source code
│   ├── prisma/           # Database schema
│   ├── server.js         # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── node_modules/
│
├── frontend/
│   ├── src/              # React components
│   ├── index.html        # Entry HTML
│   ├── vite.config.js    # Vite config
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── node_modules/
│
├── README.md             # Main documentation
├── SETUP.md              # This file
├── DEPLOYMENT.md         # Railway deployment
└── API_DOCUMENTATION.md  # API reference
```

## Next Steps

1. **Explore the code:** Review controllers, routes, components
2. **Add features:** Extend with new functionality
3. **Deploy:** Follow DEPLOYMENT.md for Railway setup
4. **Test:** Use Postman/Insomnia for API testing
5. **Optimize:** Profile performance and optimize bottlenecks

## Getting Help

1. Check error message in browser console
2. Review `API_DOCUMENTATION.md` for endpoint details
3. Check PostgreSQL credentials in `.env`
4. Verify all dependencies installed: `npm list`
5. Clear cache and restart servers
6. Review source code comments for implementation details

## Quick Reference

### View API responses
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Pass123"}'

# Get profile (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/auth/profile
```

### Frontend console debugging
```javascript
// View token
localStorage.getItem('token')

// View user
JSON.parse(localStorage.getItem('user'))

// Clear all
localStorage.clear()
```

## Success Indicators

✅ Backend server running on port 5000
✅ Frontend running on port 3000
✅ Database created and migrations applied
✅ Can sign up and login
✅ Can create projects
✅ Can create tasks
✅ Dashboard displays stats
✅ No console errors
✅ All API calls successful

You're ready to start developing! 🚀
