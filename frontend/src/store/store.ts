import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice"
import vehicleSlice from "./vehicleSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    admin:adminSlice,
    vehicle:vehicleSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
