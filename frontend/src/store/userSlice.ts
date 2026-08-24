import { User } from "@/context/AuthProvider";
import { VehiclePriceEstimationResponse } from "@/context/pricing";
import { IUserDocuments } from "@/context/userDocumentProvider";
import { CustomerBookingResponse, IVehicle } from "@/context/vehicleProvider";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userData: User | null;
  userProfileData: IUserDocuments | null;
  userBookingData: CustomerBookingResponse[] | [];
  userPaymentsData: IVehicle[] | [];
  userEstimatedPrice: VehiclePriceEstimationResponse | null;
  loading: boolean;
}

const initialState: UserState = {
  userData: null,
  userProfileData: null,
  userBookingData: [],
  userPaymentsData: [],
  userEstimatedPrice: null,
  loading: true,
};
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },

    setUserProfileData: (state, action) => {
      state.userProfileData = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUserBookingData: (state, action) => {
      state.userBookingData = action.payload;
    },

    clearUser: (state) => {
      state.userData = null;
      state.loading = false;
    },
    setUserPaymentsData: (state, action) => {
      state.userPaymentsData = action.payload;
    },
    setUserEstimatedPrice: (state, action) => {
      state.userEstimatedPrice = action.payload;
    },
  },
});

export const {
  setUserData,
  setLoading,
  clearUser,
  setUserProfileData,
  setUserBookingData,
  setUserEstimatedPrice,
  setUserPaymentsData,
} = userSlice.actions;
export default userSlice.reducer;
