import { IAuction } from "@/context/auctionProvider";
import { createSlice } from "@reduxjs/toolkit";

interface PartnerState {
  PartnerAuctionData: IAuction | null;
}

const initialState: PartnerState = {
  PartnerAuctionData: null,
};
const partnerSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setPartnerAuctionData: (state, action) => {
      state.PartnerAuctionData = action.payload;
    },
  },
});

export const { setPartnerAuctionData } = partnerSlice.actions;
export default partnerSlice.reducer;
