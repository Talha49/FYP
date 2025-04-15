import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      // ✅ Step 1: Create Task
      const response = await axios.post("/api/New/CreateTask", taskData, {
        headers: { "Content-Type": "application/json" },
      });

      const createdTask = response.data.task; // Extract the task from response

      // ✅ Step 2: Call Notification API after successful task creation
      await axios.post("/api/notifyApi", {
        userId: createdTask.userId, // Task creator ID
        title: "Task Created Successfully",
        message: `📌 Your task **"${createdTask.description}"** has been created. Check it in the **Field Notes** section.`,
        link: `/field-notes/${createdTask._id}`,
        templateName: "creation",
        priority: "high", // 🔥 Always set to high
        type: "success", // 🔄 Always set to general
        category:"general",
      });

      return createdTask;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/New/UpdateTask/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/New/GetTask/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const addAttachments = createAsyncThunk(
  'tasks/addAttachments',
  async ({ taskId, files }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('taskId', taskId);
      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await axios.post('/api/New/AddAttachments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'tasks/deleteAttachment',
  async ({ taskId, attachmentId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/New/DeleteAttachment/${taskId}/${attachmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred';
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        state.message = 'Task updated successfully';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred while updating the task';
      })
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred';
      })
      .addCase(addAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAttachments.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        state.message = 'Attachments added successfully';
      })
      .addCase(addAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred while adding attachments';
      })
      .addCase(deleteAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        state.message = 'Attachment deleted successfully';
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'An error occurred while deleting attachment';
      });

  },
});

export default taskSlice.reducer;