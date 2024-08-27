import mongoose from 'mongoose';

const FieldNoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  room: {
    type: String,
    required: [true, 'Room is required'],
    trim: true
  },
  floor: {
    type: String,
    required: [true, 'Floor is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: [true, 'Priority is required'],
    default: 'Low'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    required: [true, 'Status is required']
  },
  imageUrls: {
    type: [String],
    required: [true, 'Image URL is required'],
    validate: [arrayMinLength, 'At least one Image is required']
  },
  tags: {
    type: [String],
    required: [true, 'At least one tag is required'],
    validate: [arrayMinLength, 'At least one tag is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  assignee: {
    type: String,
    required: [true, 'Assignee is required'],
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  watchers: {
    type: Number,
    required: [true, 'Number of watchers is required'],
    min: [1, 'At least one watcher is required']
  },
  attachments: [{
    name: {
      type: String,
      required: [true, 'Attachment name is required']
    },
    url: {
      type: String,
      required: [true, 'Attachment URL is required']
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment user is required']
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

function arrayMinLength(val) {
  return val.length > 0;
}

export default mongoose.models.FieldNoteDB || mongoose.model('FieldNoteDB', FieldNoteSchema);