import { Request, Response } from 'express';
import TransactionService from '../services/transaction.service';
import logger from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';
import { User } from '@prisma/client'; // Import the User type from Prisma

// Extend the Request type to include the `user` property
interface CustomRequest extends Request {
  user?: User;
}

class TransactionController {
  // Create a new transaction
  async createTransaction(req: CustomRequest, res: Response) {
    const { title, amount, category, notes } = req.body;
    const userId = req.user?.id;

    // Validate userId
    if (typeof userId !== 'number') {
      logger.warn('Unauthorized. User ID is missing or invalid.');
      res.status(401).json({ message: 'Unauthorized. User ID is missing or invalid.' });
      return;
    }

    try {
      const transaction = await TransactionService.createTransaction(
        userId,
        title,
        amount,
        category,
        notes
      );
      logger.info(`Transaction created: ${transaction.id}`);
      res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating transaction: ${error.message}`);
      } else {
        logger.error(`Error creating transaction: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }

  // Update a transaction
  async updateTransaction(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const { title, amount, category, notes } = req.body;
    const userId = req.user?.id;

    // Validate userId
    if (typeof userId !== 'number') {
      logger.warn('Unauthorized. User ID is missing or invalid.');
      res.status(401).json({ message: 'Unauthorized. User ID is missing or invalid.' });
      return;
    }

    try {
      const transaction = await TransactionService.updateTransaction(
        parseInt(id),
        title,
        amount,
        category,
        notes
      );
      logger.info(`Transaction updated: ${transaction.id}`);
      res.status(200).json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating transaction: ${error.message}`);
      } else {
        logger.error(`Error updating transaction: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }

  // Delete a transaction
  async deleteTransaction(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    // Validate userId
    if (typeof userId !== 'number') {
      logger.warn('Unauthorized. User ID is missing or invalid.');
      res.status(401).json({ message: 'Unauthorized. User ID is missing or invalid.' });
      return;
    }

    try {
      const transaction = await TransactionService.deleteTransaction(parseInt(id));
      logger.info(`Transaction deleted: ${transaction.id}`);
      res.status(200).json({ message: 'Transaction deleted successfully', transaction });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting transaction: ${error.message}`);
      } else {
        logger.error(`Error deleting transaction: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }

  // Fetch all transactions for a user
  async getUserTransactions(req: CustomRequest, res: Response) {
    const userId = req.user?.id;

    // Validate userId
    if (typeof userId !== 'number') {
      logger.warn('Unauthorized. User ID is missing or invalid.');
      res.status(401).json({ message: 'Unauthorized. User ID is missing or invalid.' });
      return;
    }

    try {
      const transactions = await TransactionService.getUserTransactions(userId);
      logger.info(`Fetched transactions for user: ${userId}`);
      res.status(200).json({ message: 'Transactions fetched successfully', transactions });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching transactions: ${error.message}`);
      } else {
        logger.error(`Error fetching transactions: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }
}

export default new TransactionController();