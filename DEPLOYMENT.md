# Railway Deployment Guide

This guide covers deploying the Team Task Manager to Railway.app.

## Prerequisites

- GitHub account with your repository pushed
- Railway account (free tier available)
- PostgreSQL database (included in Railway free tier)

## Step 1: Deploy Backend

### 1.1 Create Railway Project for Backend

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize GitHub and select your repository
5. Select the deployment type as "NodeJS"

### 1.2 Add PostgreSQL Database

1. In the Railway dashboard, click "Add"
2. Select "PostgreSQL"
3. Railway will automatically create the database and set `DATABASE_URL` environment variable
4. This variable will be connected to your app automatically

### 1.3 Set Environment Variables

1. Go to the Variables tab in Railway dashboard
2. Add the following environment variables:

```
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=production
```

For `JWT_SECRET`, generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Configure Deployment

Railway automatically detects Node.js projects. Make sure:
- `package.json` exists in backend directory
- Start command is correctly set (Railway will detect `npm start` from package.json)
- `server.js` is the entry point

### 1.5 Deploy

1. Commit and push your changes to GitHub
2. Railway will automatically detect changes and deploy
3. Wait for deployment to complete (usually 2-5 minutes)
4. Note the generated URL (e.g., `https://task-manager-api-prod.up.railway.app`)

### 1.6 Verify Backend is Running

```bash
curl https://your-railway-backend-url/health
# Should return: {"message":"Server is running"}
```

## Step 2: Deploy Frontend

### 2.1 Create Railway Project for Frontend

1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Select the same repository
4. This time, select "Vite" or create custom deployment

### 2.2 Set Environment Variables

1. Go to the Variables tab
2. Add:

```
VITE_API_URL=https://your-railway-backend-url/api
```

Replace `your-railway-backend-url` with the actual Railway backend URL

### 2.3 Build Configuration

Create or verify `railway.json` in frontend directory:

```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm preview"
  }
}
```

Or Railway may auto-detect. Create a `Procfile`:

```
web: npm run preview
```

### 2.4 Deploy

1. Commit and push changes
2. Railway will build and deploy automatically
3. Note the generated URL

## Step 3: Verify Full Application

1. Open frontend URL in browser
2. Sign up for a new account
3. Create a project
4. Create tasks
5. Check dashboard
6. All API calls should work through the Axios interceptor

## Environment Variables Summary

### Backend (Railway)
```
DATABASE_URL=postgresql://... (Auto-set by Railway PostgreSQL plugin)
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5000
```

### Frontend (Railway)
```
VITE_API_URL=https://your-backend-railway-url/api
```

## Troubleshooting Railway Deployment

### Build Fails

1. Check build logs in Railway dashboard
2. Ensure all dependencies are in package.json
3. Verify Node.js version compatibility
4. Clear cache: Railway → Settings → Redeploy

### Deployment Timeout

1. Increase timeout in Railway settings
2. Check for infinite loops in code
3. Verify package.json scripts are correct

### Database Connection Error

1. Verify DATABASE_URL is set
2. Check PostgreSQL plugin is added
3. Run migrations after deployment:
   ```bash
   npx prisma migrate deploy
   ```

### Frontend Can't Connect to Backend

1. Verify VITE_API_URL is correct
2. Check backend is running: curl `/health` endpoint
3. Ensure CORS is enabled in backend
4. Clear browser cache and localStorage

### 401 Errors After Deployment

1. JWT_SECRET must be consistent between sessions
2. Don't change JWT_SECRET between deployments
3. Clear localStorage if secret was changed
4. Test with new token from fresh signup

## Database Backups

Railway PostgreSQL includes automatic backups. To access:

1. Go to PostgreSQL plugin in Railway
2. Click "Backups" tab
3. Download if needed

For manual backup:
```bash
pg_dump DATABASE_URL > backup.sql
```

## Scaling on Railway

Railway automatically handles:
- Load balancing
- Vertical scaling
- Database connection pooling

No additional configuration needed for basic deployment.

## Custom Domain

To add custom domain (e.g., tasksapp.com):

1. Go to Railway project settings
2. Add "Custom Domain"
3. Configure DNS records at your domain registrar
4. Wait for DNS propagation

## Monitoring

Railway provides built-in monitoring:

1. Logs: View real-time application logs
2. Metrics: CPU, memory, network usage
3. Deployments: History of all deployments
4. Rollback: Revert to previous versions

## Cost Considerations

Railway free tier includes:
- 5GB PostgreSQL storage
- 100 execution hours per month per project
- Perfect for development and small teams

Paid plans available for production use.

## Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Can sign up / login
- [ ] Can create projects
- [ ] Can create tasks
- [ ] Can update task status
- [ ] Dashboard shows statistics
- [ ] No CORS errors in console
- [ ] API calls use correct environment URL
- [ ] JWT token persists in localStorage
- [ ] Logout clears token properly

## Continuous Deployment

Railway automatically deploys on push to main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Railway detects changes automatically
4. Build and deployment begins
5. Check logs for any errors
6. Test the deployed version

## Rolling Back

If deployment fails:

1. Go to Railway dashboard
2. Select "Deployments" tab
3. Click previous successful deployment
4. Click "Redeploy"

## Performance Tips

1. **Frontend:**
   - Use Vite's optimize dependencies
   - Lazy load components if needed
   - Minimize bundle size

2. **Backend:**
   - Use database indexes (Prisma creates them)
   - Implement caching for frequently accessed data
   - Use pagination for large data sets

3. **Database:**
   - Monitor query performance
   - Use Prisma query optimization
   - Archive old completed tasks

## Security in Production

1. **Environment Variables:**
   - Never commit .env files
   - Use strong JWT_SECRET
   - Rotate secrets periodically

2. **HTTPS:**
   - Railway provides HTTPS by default
   - Use custom domain with SSL

3. **CORS:**
   - Restrict to specific origin if needed
   - Remove development settings

4. **Password Hashing:**
   - Bcryptjs with 10 salt rounds (already configured)

5. **Database:**
   - PostgreSQL encryption at rest
   - Regular backups enabled
   - Access restricted to app only

## Support

- Railway Dashboard: Real-time logs and metrics
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- GitHub Issues: For application-specific issues
- Email support available on paid plans
