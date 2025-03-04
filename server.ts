import http from 'http';
import config  from './config/constants';
import app from './app';
import { connectDB } from './config/db';
import { setupSocket } from './sockets';
import logger from './utils/logger';

const PORT = config.PORT || 5000;

// Connect to the database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket
setupSocket(server);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('Server shut down.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('Server shut down.');
    process.exit(0);
  });
});