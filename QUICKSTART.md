# 🚀 Quick Start Guide

Get the Pokemon project running in 5 minutes!

## Prerequisites
- Node.js (v18+)
- PostgreSQL
- Git

## Quick Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd pokemon

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Frontend setup
cd ../frontend
npm install
```

### 2. Database Setup
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run import:pokemon
```

### 3. Run the Project

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### 4. Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Default Credentials
- No default user - create one via signup
- Database: pokemon_db (create manually in PostgreSQL)

## One-Command Setup (Windows PowerShell)
```powershell
# Clone and setup everything
git clone <repository-url>; cd pokemon; cd backend; npm install; cd ../frontend; npm install; cd ../backend; npx prisma generate; npx prisma migrate deploy; npm run import:pokemon
```

## One-Command Setup (Mac/Linux)
```bash
# Clone and setup everything
git clone <repository-url> && cd pokemon && cd backend && npm install && cd ../frontend && npm install && cd ../backend && npx prisma generate && npx prisma migrate deploy && npm run import:pokemon
```

## Troubleshooting
- **Port 3000/4200 in use**: `npx kill-port 3000` or `npx kill-port 4200`
- **Database issues**: Check PostgreSQL is running
- **Node modules**: Delete `node_modules` and `npm install` again

Need more details? Check the main [README.md](README.md)
