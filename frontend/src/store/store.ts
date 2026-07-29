import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    admin:adminSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
