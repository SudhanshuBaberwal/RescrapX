import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice"
import vehicleSlice from "./vehicleSlice"
import partnerSlice from "./partnerSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    admin:adminSlice,
    vehicle:vehicleSlice,
    partner:partnerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
