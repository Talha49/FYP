const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from any origin; restrict this in production
    methods: ['GET', 'POST'],
  },
});

// Serve a simple API endpoint (optional)
app.get('/', (req, res) => {
  res.send("Chat server is running.");
});

// Handle socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for incoming messages from clients
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);

    // Broadcast the message to all connected clients, including the sender
    io.emit('receiveMessage', message);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
