import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthReducer";
import inboxSlice from "./InboxReducer";

const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        inbox:inboxSlice.reducer
    }
})

export default store;