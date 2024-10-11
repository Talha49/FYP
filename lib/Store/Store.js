import { configureStore } from "@reduxjs/toolkit";
import UserSlicereducer from '../Features/UserSlice'
import TaskSlicereducer from '../Features/TaskSlice'

const store = configureStore({
    reducer:{
        UserSlice:UserSlicereducer,
        TaskSlice:TaskSlicereducer
    }
})


export default store;