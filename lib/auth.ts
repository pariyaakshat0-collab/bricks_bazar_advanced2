import * as jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const JWT_SECRET_KEY = JWT_SECRET;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : '7d'
  };
  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const getAuthFromRequest = (request: NextRequest): JWTPayload | null => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  // Use bcrypt for password hashing
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  // Use bcrypt for password verification
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
};

// Password validation function
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Generate both access and refresh tokens
export const generateTokens = (user: any) => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  const accessToken = generateToken(payload);
  const refreshOptions: jwt.SignOptions = {
    expiresIn: '30d' as const
  };
  const refreshToken = jwt.sign(payload, JWT_SECRET_KEY + '_refresh', refreshOptions);
  
  return {
    accessToken,
    refreshToken
  };
};

// Refresh access token using refresh token
export const refreshAccessToken = (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET_KEY + '_refresh') as JWTPayload;
    const newAccessToken = generateToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });
    
    return {
      accessToken: newAccessToken,
      user: payload
    };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};