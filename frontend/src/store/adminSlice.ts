import { createSlice } from "@reduxjs/toolkit";
import { Partner } from "@/context/AuthProvider";
import { IUserDocuments } from "@/context/userDocumentProvider";
import { IAuction } from "@/context/auctionProvider";
import { IVehicle } from "@/context/vehicleProvider";

interface AdminState {
  allPartnersData: Partner[];
  allUsersProfileData: IUserDocuments[];
  auctionData: IAuction | null;
  pickupDetails: IVehicle | null;
}

const initialState: AdminState = {
  allPartnersData: [],
  allUsersProfileData: [],
  auctionData: null,
  pickupDetails: null,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAllPartnersData: (state, action) => {
      state.allPartnersData = action.payload;
    },
    setAllUserPrfileData: (state, action) => {
      state.allUsersProfileData = action.payload;
    },
    setAuctionData: (state, action) => {
      state.auctionData = action.payload;
    },
    setPickupDetails: (state, action) => {
      state.pickupDetails = action.payload;
    },
  },
});

export const {
  setAllPartnersData,
  setAllUserPrfileData,
  setAuctionData,
  setPickupDetails,
} = adminSlice.actions;
export default adminSlice.reducer;
