import { Request, Response } from 'express';
import TransactionService from '../services/transaction.service';
import NotificationService from '../services/notification.service';
import logger from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';
import { User } from '@prisma/client';

// Define a custom interface for the Request object
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
      // Create the transaction
      const transaction = await TransactionService.createTransaction(
        userId,
        title,
        amount,
        category,
        notes
      );

      // Create a notification for the user
      try {
        await NotificationService.createNotification(
          userId,
          `A new transaction "${title}" has been created. Amount: ${amount}.`
        );
        logger.info(`Notification created for transaction: ${transaction.id}`);
      } catch (notificationError) {
        logger.error(`Error creating notification: ${notificationError}`);
      }

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
      // Update the transaction
      const transaction = await TransactionService.updateTransaction(
        parseInt(id),
        title,
        amount,
        category,
        notes
      );

      // Create a notification for the user
      try {
        await NotificationService.createNotification(
          userId,
          `The transaction "${title}" has been updated. New amount: ${amount}.`
        );
        logger.info(`Notification created for updated transaction: ${transaction.id}`);
      } catch (notificationError) {
        logger.error(`Error creating notification: ${notificationError}`);
      }

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
      // Fetch the transaction before deleting it
      const transaction = await TransactionService.deleteTransaction(parseInt(id));

      // Create a notification for the user
      try {
        await NotificationService.createNotification(
          userId,
          `The transaction "${transaction.title}" has been deleted.`
        );
        logger.info(`Notification created for deleted transaction: ${transaction.id}`);
      } catch (notificationError) {
        logger.error(`Error creating notification: ${notificationError}`);
      }

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

      // Optionally create a notification for fetching transactions
      try {
        await NotificationService.createNotification(
          userId,
          `You have fetched your transactions. Total transactions: ${transactions.length}.`
        );
        logger.info(`Notification created for fetching transactions for user: ${userId}`);
      } catch (notificationError) {
        logger.error(`Error creating notification: ${notificationError}`);
      }

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