
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchFieldNotes = createAsyncThunk('TaskMange/GetFieldNotes', async (id) => {
   
    console.log("id",id)
   try {
<<<<<<< Updated upstream
    const res = await fetch(`/api/TaskManage/GetTask`);
=======
    const res = await fetch(`/api/TaskManage/GetTask/${id}`);
>>>>>>> Stashed changes
    if(res.ok){
        const data = await res.json();
        console.log("DF",data)
        return data.data;
        
    }
    else{
        throw new Error('Failed to fetch data');
    }
   } catch (error) {
        console.error("Error File Fetching Data", error)
   }
})

export const updateFieldNote = createAsyncThunk('TaskManage/UpdateFieldNote', async (updatedNote) => {
    try {
        const res = await fetch(`/api/TaskManage/UpdateTask/${updatedNote._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNote),
        });
        if(res.ok){
            const data = await res.json();
            return data.data;
        }
        else{
            throw new Error('Failed to update field note');
        }
    } catch (error) {
        console.error("Error updating field note", error);
        throw error;
    }
})



const FieldNotesSlice = createSlice({
    name:'FieldNotes',
    initialState:{
        FieldNotes: [],
        error: null,
        status: 'idle'
    },
    reducers:{},
    extraReducers: (builder)=>{
       
        builder
        .addCase(fetchFieldNotes.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchFieldNotes.fulfilled, (state,action) => {
            state.status = 'succeeded';
            state.FieldNotes = action.payload;
        })
        .addCase(fetchFieldNotes.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })
        .addCase(updateFieldNote.fulfilled, (state, action) =>{
            const index = state.FieldNotes.findIndex(note => note._id === action.payload._id);
            if(index !== -1){
                state.FieldNotes[index] = action.payload;
            }
        })
    }
    
})



export default FieldNotesSlice.reducer;