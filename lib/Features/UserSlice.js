import axios from 'axios';
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";


 
export const fetchUsers = createAsyncThunk('UserList/GetUser', async (token) => {
    try {
      const res = await axios.get('/api/users/get', {
        headers: {
          Authorization: token, 
        },

 });
      
      return res.data;
    } catch (error) {
      console.error("Error Fetching Data", error);
      throw new Error('Failed TO Fetch Data');
    }
  });
 
const UserSlice = createSlice({
    name:'Users',
    initialState:{
        users:[],
        error:null,
        status:'idle'
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchUsers.fulfilled, (state,action) => {
            state.status = 'succeeded';
            state.users = action.payload; 
        })
        .addCase(fetchUsers.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })
    }
})


export default UserSlice.reducer;