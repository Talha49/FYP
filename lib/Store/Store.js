import { configureStore } from "@reduxjs/toolkit";
import UserSlicereducer from "../Features/UserSlice";
import TaskSlicereducer from "../Features/TaskSlice";
import VTourReducer from "@/lib/Features/VtourSlice";

const store = configureStore({
  reducer: {
    UserSlice: UserSlicereducer,
    TaskSlice: TaskSlicereducer,
    VTour: VTourReducer,
  },
});

export default store;
