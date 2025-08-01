# 🚀 Deployment Guide

## Authentication System Overview

Your application now includes a **comprehensive authentication system** with:

✅ **User Registration & Login**  
✅ **JWT Token Authentication**  
✅ **Password Hashing (bcryptjs)**  
✅ **Role-Based Access Control (USER/ADMIN)**  
✅ **SQLite Database with Prisma ORM**  
✅ **Protected Routes & Components**  
✅ **Rate Limiting & Security Features**  
✅ **User Profile Management**

---

## 🏁 Quick Start

### 1. **Development Setup** (First Time)

```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

**Test Accounts Created:**

- 👤 **Admin:** `admin@example.com` / `admin123`
- 👤 **User:** `user@example.com` / `user123`

### 2. **Development Server**

- **Frontend:** http://localhost:5173 (Vite dev server)
- **Backend:** http://localhost:8080 (Express API server)
- **Authentication:** ✅ Full JWT-based auth system

---

## 🏗️ Production Deployment

### Build for Production

```bash
# Build the entire application
npm run build

# Start production server
npm run start:prod
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=production
```

**⚠️ Security Note:** Always change `JWT_SECRET` in production!

---

## 📁 Project Structure

```
Authentication System Files:
├── prisma/
│   ├── schema.prisma          # Database schema with User model
│   └── seed.ts               # Test user creation
├── server/
│   ├── auth.ts               # JWT utilities & middleware
│   ├── db.ts                 # Prisma client singleton
│   ├── routes/auth.ts        # Authentication API endpoints
│   ├── index.ts              # Main server (production)
│   ├── index-dev.ts          # Development server
│   └── node-build-prod.ts    # Production server builder
├── client/
│   ├── context/AuthContext.tsx    # Authentication state management
│   ├── components/
│   │   ├── ProtectedRoute.tsx     # Route protection
│   │   └── Header.tsx             # Auth UI integration
│   └── pages/
│       ├── Login.tsx              # Login form
│       ├── Register.tsx           # Registration form
│       └── Profile.tsx            # User profile management
└── shared/
    ├── types.ts              # Auth type definitions
    └── api.ts                # API client functions
```

---

## 🔐 Security Features

### Password Security

- **bcryptjs hashing** with 12 salt rounds
- **Password confirmation** on registration
- **Secure password change** functionality

### JWT Authentication

- **7-day token expiration**
- **HTTP-only cookie support**
- **Automatic token refresh**
- **Secure logout** (token invalidation)

### Rate Limiting

- **15 requests per 15 minutes** for auth endpoints
- **Protection against brute force attacks**
- **IP-based limiting**

### Role-Based Access Control

- **USER role:** Standard access
- **ADMIN role:** Administrative privileges
- **Protected routes** by role
- **Component-level protection**

---

## 🔧 API Endpoints

### Authentication Routes

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
PUT  /api/auth/password    # Change password
```

### Example Usage

```javascript
// Login
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "admin123",
  }),
});

// Get current user (with JWT token)
const user = await fetch("/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 🧪 Testing

### Manual Testing

1. **Registration:** Create new account at `/register`
2. **Login:** Sign in with test accounts
3. **Protected Routes:** Try accessing `/profile` without login
4. **Role Access:** Test admin-only features
5. **Profile Management:** Update user information
6. **Password Change:** Test password update functionality

### Database Management

```bash
# View database (SQLite)
npm run db:push          # Apply schema changes
npm run db:seed          # Recreate test users
npm run db:reset         # Reset database completely
```

---

## 🚀 Deployment Platforms

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables in Vercel dashboard:
# JWT_SECRET, DATABASE_URL, NODE_ENV=production
```

### Railway Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Prisma Client not found"**

```bash
npm run db:generate
```

**2. "Database doesn't exist"**

```bash
npm run db:push
npm run db:seed
```

**3. "JWT Secret not set"**

- Ensure `.env` file has `JWT_SECRET`
- Restart the server after adding env vars

**4. "Authentication not working"**

- Check browser console for errors
- Verify API endpoints are responding
- Ensure JWT token is being sent in headers

### Development vs Production

**Development:**

- Uses `index-dev.ts` with mock auth for Vite compatibility
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

**Production:**

- Uses `index.ts` with full authentication
- Single server serves both frontend and API
- Configured for deployment platforms

---

## 📚 Next Steps

### Recommended Enhancements

1. **Email Verification:** Add email confirmation on registration
2. **Password Reset:** Implement forgot password functionality
3. **2FA:** Add two-factor authentication
4. **Session Management:** Advanced session handling
5. **Audit Logging:** Track user actions
6. **OAuth Integration:** Google/GitHub login

### Database Scaling

- **PostgreSQL:** For production workloads
- **Connection Pooling:** For high traffic
- **Database Migrations:** Automated schema updates

---

## 🎯 Summary

Your authentication system is **production-ready** with:

✅ **Complete user management**  
✅ **Secure password handling**  
✅ **JWT-based authentication**  
✅ **Role-based access control**  
✅ **Rate limiting & security**  
✅ **Clean API design**  
✅ **React integration**  
✅ **Development & production configs**

**Test the system now at:** http://localhost:5173

**Happy coding! 🎉**
