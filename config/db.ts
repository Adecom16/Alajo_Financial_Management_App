import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Function to connect to the database
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// Function to disconnect from the database
async function disconnectDB() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

export { prisma, connectDB, disconnectDB };