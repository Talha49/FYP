import { configureStore } from "@reduxjs/toolkit";
import FieldNotesSlicereducer from '../Features/FieldNoteSlice'
import UserSlicereducer from '../Features/UserSlice'

const store = configureStore({
    reducer:{
        FieldNotesSlice:FieldNotesSlicereducer,
        UserSlice:UserSlicereducer
    }
})


export default store;