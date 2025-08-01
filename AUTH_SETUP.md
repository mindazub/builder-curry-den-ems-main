# Authentication System Documentation

## Overview

This application now includes a complete authentication system with:

- User registration and login
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Password hashing with bcrypt
- SQLite database with Prisma ORM
- Protected routes
- User profile management

## Features

### 🔐 Authentication

- **Registration**: Create new user accounts with email validation
- **Login**: Secure login with JWT tokens
- **Logout**: Token-based logout
- **Protected Routes**: Automatic redirect to login for unauthenticated users

### 👤 User Management

- **Profile Updates**: Users can update their first/last names
- **Password Changes**: Secure password change functionality
- **Role-Based Access**: Admin and User roles with different permissions

### 🛡️ Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Tokens**: 7-day expiration
- **Rate Limiting**: 5 attempts per 15 minutes for auth endpoints
- **Input Validation**: Email format and password strength validation

## Database Schema

```sql
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Request/Response Examples

#### Register

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token-here"
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "jwt-token-here"
}
```

## Frontend Integration

### Authentication Context

The `AuthContext` provides authentication state and methods throughout the app:

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Protected Routes

Use the `ProtectedRoute` component to protect pages:

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/admin" element={
  <ProtectedRoute adminOnly>
    <AdminPanel />
  </ProtectedRoute>
} />
```

### Available Pages

- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile management
- All existing routes are now protected

## Development vs Production

### Development Mode

- Uses simplified mock auth endpoints in `server/index-dev.ts`
- No database required for frontend development
- Allows testing of auth UI without full backend setup

### Production Mode

- Uses full authentication system with SQLite database
- Requires running `npm run db:push` and `npm run db:seed`
- JWT tokens and full security features enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Seed with test users
npm run db:seed
```

### 3. Environment Variables

Update `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
```

### 4. Development

```bash
npm run dev
```

## Test Users

After running `npm run db:seed`, you can use these test accounts:

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with test users
- `npm run db:reset` - Reset database and reseed

## Security Considerations

### Production Deployment

1. Change the JWT_SECRET to a strong, random string
2. Use environment variables for all secrets
3. Enable HTTPS
4. Consider using a more robust database (PostgreSQL, MySQL)
5. Implement additional rate limiting
6. Add audit logging
7. Consider implementing refresh tokens

### Password Requirements

- Minimum 6 characters (can be increased)
- Consider adding complexity requirements
- Implement password reset functionality

## Extending the System

### Adding New Roles

1. Update the `Role` enum in `prisma/schema.prisma`
2. Run `npm run db:push`
3. Update the role check logic in components and middleware

### Adding New User Fields

1. Update the User model in `prisma/schema.prisma`
2. Update the registration form and API
3. Update the profile management interface

### OAuth Integration

The current system can be extended with OAuth providers (Google, GitHub, etc.) by:

1. Installing passport.js or similar
2. Adding OAuth routes
3. Linking OAuth accounts to local users

## Troubleshooting

### Common Issues

1. **Prisma Client not found**

   ```bash
   npm run db:generate
   ```

2. **Database doesn't exist**

   ```bash
   npm run db:push
   ```

3. **No test users**

   ```bash
   npm run db:seed
   ```

4. **Development server won't start**
   - Check that you're not importing Prisma in client-side code
   - Verify the Vite configuration is using the dev server setup

### Development vs Production Switch

The app automatically uses:

- Development mode: Mock auth when `NODE_ENV !== 'production'`
- Production mode: Full database auth when `NODE_ENV === 'production'`
