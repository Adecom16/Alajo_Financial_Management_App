import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';
import logger from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';
import { User } from '@prisma/client'; // Import the User type from Prisma

// Define a custom interface for the Request object
interface CustomRequest extends Request {
  user?: User;
}

class NotificationController {
  // Fetch all notifications for a user
  async getUserNotifications(req: CustomRequest, res: Response) {
    const userId = req.user?.id;

    // Validate userId
    if (typeof userId !== 'number') {
      logger.warn('Unauthorized. User ID is missing or invalid.');
      res.status(401).json({ message: 'Unauthorized. User ID is missing or invalid.' });
      return;
    }

    try {
      const notifications = await NotificationService.getUserNotifications(userId);
      logger.info(`Fetched notifications for user: ${userId}`);
      res.status(200).json({ message: 'Notifications fetched successfully', notifications });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching notifications: ${error.message}`);
      } else {
        logger.error(`Error fetching notifications: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }

  // Mark a notification as read
  async markAsRead(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    // Validate userId
    if (typeof userId !== 'number') {
      logger.warn('Unauthorized. User ID is missing or invalid.');
      res.status(401).json({ message: 'Unauthorized. User ID is missing or invalid.' });
      return;
    }

    try {
      const notification = await NotificationService.markAsRead(parseInt(id));
      logger.info(`Notification marked as read: ${notification.id}`);
      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error marking notification as read: ${error.message}`);
      } else {
        logger.error(`Error marking notification as read: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }
}

export default new NotificationController();