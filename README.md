# 🎮 Pokemon Project

A full-stack Pokemon application built with Angular frontend and NestJS backend, featuring Pokemon browsing, favorites management, video carousel, and CSV import functionality.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🔍 **Pokemon Search & Filtering**: Search by name, type, generation, and stats
- ❤️ **Favorites Management**: Add/remove Pokemon from favorites with JWT authentication
- 🎥 **Video Carousel**: Featured Pokemon videos with YouTube integration
- 📊 **CSV Import**: Bulk import Pokemon data via CSV files
- 📱 **Responsive Design**: Mobile-friendly interface with Material UI
- 🔐 **Authentication**: JWT-based user authentication and authorization
- 📄 **Pagination**: Efficient data loading with customizable page sizes
- 🎨 **Modern UI**: Beautiful card-based layout with type-based styling

## 🛠️ Tech Stack

### Frontend
- **Angular 18** - Modern TypeScript framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **SCSS** - Styling with animations and gradients

### Backend
- **NestJS** - Node.js framework with TypeScript
- **Prisma** - Modern database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File upload handling

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pokemon
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your database credentials and JWT secret
```

Create a `.env` file in the backend directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pokemon_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Import Pokemon data from CSV file
npm run import:pokemon

# (Optional) Seed the database with additional data
npx prisma db seed
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment
cp src/environments/environment.example.ts src/environments/environment.ts
# Edit environment files if needed
```

## 🏃‍♂️ Running the Project

### Method 1: Development Mode (Recommended)

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
The backend will run on `http://localhost:3000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
# or
ng serve
```
The frontend will run on `http://localhost:4200`

### Method 2: Production Build

#### Backend
```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with a web server
npx serve dist/frontend
```

### Method 3: Watch Mode (For Development)

#### Backend with Auto-reload
```bash
cd backend
npm run start:dev
# Automatically restarts on file changes
```

#### Frontend with Hot Reload
```bash
cd frontend
ng serve --open
# Automatically reloads browser on changes
# --open flag opens the browser automatically
```

### Method 4: Debug Mode

#### Backend Debug
```bash
cd backend
npm run start:debug
# Runs with Node.js debugger on port 9229
```

#### Frontend Build Analysis
```bash
cd frontend
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json
```

## 📁 Project Structure

```
pokemon/
├── README.md
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── common/            # Shared utilities and guards
│   │   ├── favorites/         # Favorites management
│   │   ├── pokemons/          # Pokemon CRUD operations
│   │   ├── prisma/            # Database service
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── scripts/               # Utility scripts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── auth/          # Authentication components
    │   │   ├── components/    # Reusable UI components
    │   │   ├── favorites/     # Favorites page
    │   │   ├── home/          # Homepage with video carousel
    │   │   ├── pokemons/      # Pokemon list and detail pages
    │   │   └── services/      # API services
    │   ├── assets/            # Static assets
    │   └── environments/      # Environment configurations
    └── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Pokemon
- `GET /api/pokemons` - Get Pokemon list with filters
- `GET /api/pokemons/:id` - Get single Pokemon
- `POST /api/pokemons/import` - Import Pokemon from CSV

### Favorites
- `GET /api/favorites/users/me` - Get user's favorites
- `POST /api/favorites/:pokemonId` - Add to favorites
- `DELETE /api/favorites/:pokemonId` - Remove from favorites

## 💻 Development

### Backend Development

```bash
cd backend

# Run in development mode with hot reload
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
cd frontend

# Serve with hot reload
ng serve

# Build for production
ng build

# Run tests
ng test

# Run e2e tests
ng e2e

# Lint code
ng lint
```

### Database Operations

```bash
cd backend

# View database in Prisma Studio
npx prisma studio

# Import Pokemon data from CSV
npm run import:pokemon

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset

# Generate types after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration-name
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_ctl status

# Start PostgreSQL
pg_ctl start

# Verify connection
psql -U username -d pokemon_db
```

#### 2. Port Already in Use
```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 4200 (frontend)
npx kill-port 4200
```

#### 3. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database if schema changed
npx prisma migrate reset
npx prisma migrate deploy
```

#### 5. Angular Build Issues
```bash
# Clear Angular cache
ng cache clean

# Reinstall Angular CLI globally
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

### Environment Variables

Make sure your environment variables are correctly set:

**Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pokemon_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
```

**Frontend (environment.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Performance Tips

1. **Enable Angular Production Mode**
   ```bash
   ng build --prod
   ```

2. **Use Angular DevKit**
   ```bash
   ng add @angular/pwa
   ```

3. **Optimize Database Queries**
   - Use Prisma query optimization
   - Implement proper indexing
   - Use pagination for large datasets

## 📝 Scripts Reference

### Backend Scripts
- `npm start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugger
- `npm run start:prod` - Start production build
- `npm run build` - Build application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run e2e` - Run end-to-end tests
- `npm run lint` - Lint TypeScript files
- `npm run extract-i18n` - Extract i18n messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀**

For any issues or questions, please create an issue in the repository.
