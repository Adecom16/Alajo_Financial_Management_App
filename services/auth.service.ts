import { PrismaClient, User } from '@prisma/client';
import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/constants';

class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Signup a new user
  async signup(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  // Login an existing user
  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }
}

export default new AuthService();