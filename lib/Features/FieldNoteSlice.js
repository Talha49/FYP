import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Import axios

// Fetch Field Notes using axios
export const fetchFieldNotes = createAsyncThunk('TaskManage/GetFieldNotes', async (id, { rejectWithValue }) => {
   try {
       const res = await axios.get(`/api/TaskManage/GetTask`);
       return res.data.data;
   } catch (error) {
       console.error("Error Fetching Data", error);
       return rejectWithValue('Failed to fetch data');
   }
});

// Update Field Note using axios
export const updateFieldNote = createAsyncThunk('TaskManage/UpdateFieldNote', async (updatedNote, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/api/TaskManage/UpdateTask/${updatedNote._id}`, updatedNote, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.data.data;
    } catch (error) {
        console.error("Error updating field note", error);
        return rejectWithValue('Failed to update field note');
    }
});

const FieldNotesSlice = createSlice({
    name: 'FieldNotes',
    initialState: {
        FieldNotes: [],
        error: null,
        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFieldNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFieldNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.FieldNotes = action.payload;
            })
            .addCase(fetchFieldNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Updated to use rejectWithValue message
            })
            .addCase(updateFieldNote.fulfilled, (state, action) => {
                const index = state.FieldNotes.findIndex(note => note._id === action.payload._id);
                if (index !== -1) {
                    state.FieldNotes[index] = action.payload;
                }
            });
    },
});

export default FieldNotesSlice.reducer;
