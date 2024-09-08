import axios from 'axios';
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";


 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNjM2QwODM4Y2MwYTc1ZTVlNDc0NTQiLCJlbWFpbCI6ImdoYXVyaXQ4MkBnbWFpbC5jb20iLCJpYXQiOjE3MjUwOTc0MzIsImV4cCI6MTcyNTE4MzgzMn0.zBBWT0I9naKLkhqNb0tf4zB84DPC_rX5fXWT3gbUMCU"
export const fetchUsers = createAsyncThunk('UserList/GetUser', async () => {
    try {
      const res = await axios.get('/api/users/get', {
        headers: {
          Authorization: token, // Passing the token as a string without Bearer
        },

      });
      console.log("res", res)
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