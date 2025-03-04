import { PrismaClient, Transaction } from '@prisma/client';
import { prisma } from '../config/db';

class TransactionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Create a new transaction
  async createTransaction(
    userId: number,
    title: string,
    amount: number,
    category?: string,
    notes?: string
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        title,
        amount,
        category,
        notes,
        userId,
      },
    });
  }

  // Update a transaction
  async updateTransaction(
    id: number,
    title?: string,
    amount?: number,
    category?: string,
    notes?: string
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        title,
        amount,
        category,
        notes,
      },
    });
  }

  // Delete a transaction
  async deleteTransaction(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  // Fetch all transactions for a user
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
    });
  }
}

export default new TransactionService();