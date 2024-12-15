import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import ChatRoom from '../lib/models/chatRoom.mjs';  // Adjust path if necessary

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client URL
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
mongoose.connect('mongodb+srv://FYP-SIJM:SIJM_12345@cluster0.1gtvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Dummy system ObjectId
const SYSTEM_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000'); // A dummy system user ObjectId

const userSocketMap = {}; // Store userId to socket.id mapping

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle the user ID when a user connects
  socket.on('setUser', (userId) => {
    console.log(`User ID ${userId} is connected with Socket ID ${socket.id}`);
    userSocketMap[userId] = socket.id;  // Map the userId to the socket ID
  });

  // In your `sendMessage` handler
  socket.on('sendMessage', async (messageObject) => {
    try {
      console.log('Received message:', messageObject);
  
      const { chatRoomId, text, senderId, senderName, media, senderImage, isSystemMessage, time, fullTimestamp } = messageObject;
      const formattedTime = time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const formattedFullTimestamp = fullTimestamp || new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  
      const systemImagePath = 'https://firebasestorage.googleapis.com/v0/b/sijm-74506.appspot.com/o/systemImage%2Fsystem.jpg?alt=media&token=b2a0fdda-25e3-4a84-a7d5-40b48257869a';  // Adjust path accordingly
      const senderFallbackImagePath = 'https://firebasestorage.googleapis.com/v0/b/sijm-74506.appspot.com/o/systemImage%2Fpngwing.com.png?alt=media&token=1b0acd08-66ae-41ef-9775-3b27e4aa0aa7';  // Path for sender fallback
      const messageSenderImage = isSystemMessage ? systemImagePath : (senderImage || senderFallbackImagePath);


      // Convert chatRoomId to ObjectId
      let taskId;
      try {
        taskId = new mongoose.Types.ObjectId(chatRoomId);
      } catch (err) {
        console.error("Invalid chatRoomId:", chatRoomId, err);
        return;
      }
  
      // Query the chat room using the taskId
      const chatRoom = await ChatRoom.findOne({ taskId });
  
      if (chatRoom) {
        // Add the new message to the messages array
        chatRoom.messages.push({
          senderId: isSystemMessage ? SYSTEM_USER_ID : senderId,
          senderName: isSystemMessage ? "System" : senderName,
          text,
          media,
          senderImage: messageSenderImage,  // Use the correct image based on the message type and sender
          timestamp: new Date(),
          fullTimestamp: formattedFullTimestamp,
          time: formattedTime,
        });
  
        // Save the updated chat room
        await chatRoom.save();
  
        // Emit only the new message to clients in the room
        io.to(chatRoomId).emit('receiveMessage', messageObject);
        console.log('Message saved and broadcasted to chat room:', chatRoomId);
      } else {
        console.log('Chat room not found for taskId:', chatRoomId);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  

  // Handle user joining a chat room
  socket.on('joinChatRoom', async (chatRoomId) => {
    try {
      let taskId;
      try {
        taskId = new mongoose.Types.ObjectId(chatRoomId);
      } catch (err) {
        console.error("Invalid chatRoomId (taskId):", chatRoomId, err);
        return;
      }
  
      // Check if the user is already in the room
      if (socket.rooms.has(chatRoomId)) {
        console.log(`User already in chat room: ${chatRoomId}`);
        return; // Prevent rejoining
      }
  
      // Query the database for the chat room using taskId
      const chatRoom = await ChatRoom.findOne({ taskId });
  
      if (chatRoom) {
        // Join the chat room
        socket.join(chatRoomId);
  
        // Emit previous messages to the user joining the chat room
        socket.emit('loadMessages', chatRoom.messages);
  
        console.log(`User joined chat room: ${chatRoomId}`);
      } else {
        console.log('Chat room not found for taskId:', chatRoomId);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  });
  
//delete the message 
socket.on('deleteMessage', async ({ chatRoomId, messageId, deletedBy }) => {
  try {
    // Validate input
    if (!chatRoomId || !messageId || !deletedBy) {
      console.error('Invalid chatRoomId, messageId, or deletedBy');
      return;
    }

    // Convert messageId to ObjectId if it's not already
    let messageObjectId;
    try {
      messageObjectId = new mongoose.Types.ObjectId(messageId);
    } catch (err) {
      console.error('Invalid messageId format:', messageId);
      return;
    }

    // Find the chat room by taskId (chatRoomId)
    const chatRoom = await ChatRoom.findOne({ taskId: chatRoomId });

    if (!chatRoom) {
      console.error(`Chat room with id ${chatRoomId} not found`);
      return;
    }

    // Find the index of the message to be deleted by its _id
    const messageIndex = chatRoom.messages.findIndex(msg => msg._id.toString() === messageObjectId.toString());

    if (messageIndex === -1) {
      console.error(`Message with id ${messageId} not found in chat room ${chatRoomId}`);
      return;
    }

    // Remove the message from the array
    chatRoom.messages.splice(messageIndex, 1);

    // Save the updated chat room document
    await chatRoom.save();

    // Emit message deleted to all clients in the room
    io.to(chatRoomId).emit('messageDeleted', {
      messageId, 
      deletedBy,  // Send the name of the user who deleted the message
    });

    // Send a system message to notify others about the deletion
    const systemMessage = {
      text: `${deletedBy} deleted a message`,
      senderId: null,  // System message does not have a sender
      senderName: 'System',
      senderImage: null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      isSystemMessage: true,
      media: [],
      chatRoomId
    };

    // Emit the system message to all users in the chat room
    io.to(chatRoomId).emit('receiveMessage', systemMessage);

    console.log(`Message with id ${messageId} deleted by ${deletedBy} from chat room ${chatRoomId}`);

  } catch (error) {
    console.error("Error deleting message:", error);
  }
});

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the userId to socketId mapping when user disconnects
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });
});

// Start server
server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
