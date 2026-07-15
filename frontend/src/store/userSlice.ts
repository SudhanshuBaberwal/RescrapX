import { User } from "@/context/AuthProvider";
import { createSlice } from "@reduxjs/toolkit"

interface UserState {
  userData: User | null;
  loading: boolean;
}

const initialState:UserState = {
    userData:null,
    loading:true
}
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
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

export const { setUserData, setLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;