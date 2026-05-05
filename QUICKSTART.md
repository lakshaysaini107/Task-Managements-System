# Quick Start

Get Team Task Manager running locally with Node.js and the included SQLite dev database.

## Prerequisites

- Node.js 16+
- A terminal or command prompt

On Windows PowerShell, use `npm.cmd` if `npm` is blocked by execution policy.

## 1. Backend Setup

```bash
cd backend
npm.cmd install
npm.cmd run setup
npm.cmd run dev
```

The backend runs at `http://localhost:5000`.

`npm.cmd run setup` creates `backend/prisma/dev.db` and generates Prisma Client.

## 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

The frontend runs at `http://localhost:3000`.

## 3. Try The App

- Open `http://localhost:3000`
- Sign up with any test email and password
- Create a project
- Add tasks
- Create another user account if you want to add members by email
- Check the dashboard

## Useful Checks

```bash
cd backend
npm.cmd start
```

Then open `http://localhost:5000/health`.

```bash
cd frontend
npm.cmd run build
```
