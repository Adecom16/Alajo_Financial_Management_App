import { PrismaClient, Notification } from '@prisma/client';
import { prisma } from '../config/db';

class NotificationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
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