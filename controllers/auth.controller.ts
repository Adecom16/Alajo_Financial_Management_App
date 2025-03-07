import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import NotificationService from '../services/notification.service'; // Import NotificationService
import logger from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';

class AuthController {
  // Signup a new user
  async signup(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await AuthService.signup(email, password);
      logger.info(`User created: ${user.email}`);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating user: ${error.message}`);
      } else {
        logger.error(`Error creating user: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }

  // Login an existing user
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { user, token } = await AuthService.login(email, password);

      // Create a notification for the user
      await NotificationService.createNotification(
        user.id,
        `You have successfully logged in.`
      );

      logger.info(`User logged in: ${email}`);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error logging in: ${error.message}`);
      } else {
        logger.error(`Error logging in: ${error}`);
      }
      errorHandler(error, req, res, () => {});
    }
  }

  // Logout a user (optional, depending on your JWT implementation)
  async logout(req: Request, res: Response) {
    logger.info(`User logged out`);
    res.status(200).json({ message: 'Logout successful' });
  }
}

export default new AuthController();