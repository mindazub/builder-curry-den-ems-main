import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const SALT_ROUNDS = 12;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (userId: number, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

// Authentication middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token) as any;
    
    // Verify user still exists and is active
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Admin only middleware
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
