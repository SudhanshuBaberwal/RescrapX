import { User } from "@/context/AuthProvider";
import { IUserDocuments } from "@/context/userDocumentProvider";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userData: User | null;
  userProfileData: IUserDocuments | null;
  loading: boolean;
}

const initialState: UserState = {
  userData: null,
  userProfileData: null,
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

    clearUser: (state) => {
      state.userData = null;
      state.loading = false;
    },
  },
});

export const { setUserData, setLoading, clearUser, setUserProfileData } =
  userSlice.actions;
export default userSlice.reducer;
