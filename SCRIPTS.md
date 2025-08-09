# 📜 Scripts Reference

## Backend Scripts (in `/backend` directory)

### Development
```bash
npm run start:dev     # Start development server with hot reload
npm run start:debug   # Start with Node.js debugger (port 9229)
npm run start:prod    # Start production server
```

### Building
```bash
npm run build         # Build the application
npm run prebuild      # Clean dist folder before build
```

### Testing
```bash
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage report
npm run test:e2e      # Run end-to-end tests
```

### Code Quality
```bash
npm run lint          # Lint TypeScript files
npm run format        # Format code with Prettier
```

### Database
```bash
npx prisma generate   # Generate Prisma client
npx prisma migrate dev # Create and apply new migration
npx prisma migrate deploy # Apply migrations
npx prisma studio     # Open Prisma Studio (database GUI)
npx prisma db seed    # Seed database with sample data
npm run import:pokemon # Import Pokemon data from pokemon_data.csv
```

## Frontend Scripts (in `/frontend` directory)

### Development
```bash
npm start             # Start development server (http://localhost:4200)
ng serve              # Same as npm start
ng serve --open       # Start and open browser automatically
ng serve --port 4201  # Start on different port
```

### Building
```bash
npm run build         # Build for production
ng build              # Same as npm run build
ng build --prod       # Production build with optimizations
ng build --watch      # Build and watch for changes
```

### Testing
```bash
npm run test          # Run unit tests with Karma
ng test               # Same as npm run test
ng test --watch=false # Run tests once (CI mode)
npm run e2e           # Run end-to-end tests
ng e2e                # Same as npm run e2e
```

### Code Quality
```bash
ng lint               # Lint TypeScript files
ng extract-i18n       # Extract i18n messages
```

### Analysis
```bash
ng build --stats-json # Build with bundle stats
ng analytics          # Enable/disable analytics
```

## Useful Combinations

### Full Project Start
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2  
cd frontend && npm start
```

### Full Project Build
```bash
# Build both projects
cd backend && npm run build
cd ../frontend && npm run build
```

### Reset Everything
```bash
# Backend reset
cd backend
rm -rf node_modules dist
npm install
npx prisma generate

# Frontend reset
cd ../frontend
rm -rf node_modules dist
npm install
```

### Database Reset
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
npx prisma db seed
```

## Environment-Specific Scripts

### Development
```bash
# Backend dev mode
npm run start:dev

# Frontend dev mode
ng serve
```

### Production
```bash
# Backend production
npm run build
npm run start:prod

# Frontend production
ng build --prod
# Then serve the dist folder
```

### Testing
```bash
# Run all tests
cd backend && npm run test:cov
cd ../frontend && npm run test -- --watch=false
```

## Docker Commands (if using Docker)

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## Git Workflow Commands

```bash
# Setup
git clone <repo-url>
cd pokemon

# Feature development
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "Add your feature"
git push origin feature/your-feature

# Update dependencies
npm update  # In both backend and frontend directories
```

## Performance & Debugging

### Backend Debugging
```bash
# Start with debugger
npm run start:debug

# Memory usage
node --inspect --max-old-space-size=4096 dist/main.js

# Profile performance
node --prof dist/main.js
```

### Frontend Debugging
```bash
# Development with source maps
ng serve --source-map

# Bundle analysis
ng build --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json

# Performance budget check
ng build --budget-error
```

## Quick Commands Summary

| Task | Backend | Frontend |
|------|---------|----------|
| Install | `npm install` | `npm install` |
| Start Dev | `npm run start:dev` | `npm start` |
| Build | `npm run build` | `ng build` |
| Test | `npm run test` | `ng test` |
| Lint | `npm run lint` | `ng lint` |

---

💡 **Tip**: Add these scripts to your IDE/editor for quick access!
