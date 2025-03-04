import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import notificationRoutes from './routes/notification.routes';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';
import { setupSwagger } from './config/swagger'; 

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(json()); // Parse JSON request bodies

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/transactions', transactionRoutes); // Transaction routes
app.use('/notifications', notificationRoutes); // Notification routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Swagger API documentation
setupSwagger(app);

// Error-handling middleware (must be after all other middleware and routes)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;