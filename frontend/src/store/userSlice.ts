import { User } from "@/context/AuthProvider";
import { IUserDocuments } from "@/context/userDocumentProvider";
import { CustomerBookingResponse } from "@/context/vehicleProvider";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userData: User | null;
  userProfileData: IUserDocuments | null;
  userBookingData: CustomerBookingResponse[] | [];
  loading: boolean;
}

const initialState: UserState = {
  userData: null,
  userProfileData: null,
  userBookingData: [],
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
  },
});

export const {
  setUserData,
  setLoading,
  clearUser,
  setUserProfileData,
  setUserBookingData,
} = userSlice.actions;
export default userSlice.reducer;
