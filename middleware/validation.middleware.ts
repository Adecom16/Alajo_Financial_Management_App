import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Example schema for creating a transaction
const createTransactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be a positive number'),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export const validateCreateTransaction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createTransactionSchema.parse(req.body); // Validate the request body
    next();
  } catch (error) {
    res.status(400).json({ message: 'Validation failed', error });
  }
};