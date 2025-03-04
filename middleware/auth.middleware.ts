import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import config from '../config/constants';
import { User } from '@prisma/client'; // Import the User type from Prisma

// Define a custom interface for the Request object
interface CustomRequest extends Request {
  user?: User;
}

export const authenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      res.status(401).json({ message: 'Invalid token.' });
      return;
    }

    req.user = user; // Attach the user object to the Request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};