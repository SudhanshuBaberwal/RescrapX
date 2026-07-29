import { createSlice } from "@reduxjs/toolkit";
import { Partner } from "@/context/AuthProvider";

interface AdminState {
  allPartnersData: Partner[];
}

const initialState: AdminState = {
  allPartnersData: [],
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAllPartnersData: (state, action) => {
      state.allPartnersData = action.payload;
    },
  },
});

export const { setAllPartnersData } = adminSlice.actions;
export default adminSlice.reducer;
