import { createSlice } from "@reduxjs/toolkit";
import { Partner } from "@/context/AuthProvider";
import { IUserDocuments } from "@/context/userDocumentProvider";

interface AdminState {
  allPartnersData: Partner[];
  allUsersProfileData : IUserDocuments[]
}

const initialState: AdminState = {
  allPartnersData: [],
  allUsersProfileData:[]
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAllPartnersData: (state, action) => {
      state.allPartnersData = action.payload;
    },
    setAllUserPrfileData:(state,action) => {
      state.allUsersProfileData = action.payload;
    }
  },
});

export const { setAllPartnersData , setAllUserPrfileData } = adminSlice.actions;
export default adminSlice.reducer;
