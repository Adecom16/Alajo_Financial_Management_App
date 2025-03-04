import { Server } from 'socket.io';
import http from 'http';

// Initialize WebSocket server
function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins (update in production)
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for transaction updates
    socket.on('updateTransaction', (data) => {
      console.log('Transaction updated:', data);
      // Broadcast the update to all users
      io.emit('transactionUpdated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
}

export { setupSocket };