import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { insertUserSchema, type User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate input
    const validationResult = insertUserSchema.safeParse({ username, email, password, firstName, lastName });
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid input', errors: validationResult.error.errors });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const existingEmail = await storage.getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};