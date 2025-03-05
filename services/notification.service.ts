import { PrismaClient, Notification } from '@prisma/client';
import { prisma } from '../config/db';

class NotificationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Create a new notification
  async createNotification(userId: number, message: string): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
        read: false, // Notifications are unread by default
      },
    });
  }

  // Fetch all notifications for a user
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
    });
  }

  // Mark a notification as read
  async markAsRead(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}

export default new NotificationService();