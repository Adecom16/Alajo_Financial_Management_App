import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    logger.error(`Error: ${err.message}`);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', error: err.message });
    }

    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  }

  res.status(500).json({ message: 'Something went wrong', error: 'An unknown error occurred' });
};