import mongoose from 'mongoose';

// Define the message schema
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' }, // Sender's User ID
  senderName: { type: String, required: true }, // Sender's name
  text: { type: String, required: true }, // Message content
  media: { type: Array, default: [] }, // Media files like images, videos, etc.
  senderImage: { type: String },  // Optional, store sender image URL
  timestamp: { type: Date, default: Date.now }, // Timestamp when the message was sent
  isSystemMessage: { type: Boolean, default: false }, // Added field
  fullTimestamp: { 
    type: String, 
    required: true, 
    default: () => new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) 
  },
  time: { 
    type: String, 
    required: true, 
    default: () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
  },
});

// Define the chat room schema
const ChatRoomSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'NewTask' }, // Task reference
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Creator's user ID
  creatorName: { type: String, required: true }, // Creator's name
  messages: { type: [messageSchema], default: [] }, // Store messages as an array of message objects
});

export default mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);
