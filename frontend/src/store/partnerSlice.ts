import { IAuction, MyBidStatus } from "@/context/auctionProvider";
import { createSlice } from "@reduxjs/toolkit";

interface PartnerState {
  PartnerAuctionData: IAuction | null;
  PartnerBidsData: MyBidStatus | null;
}

const initialState: PartnerState = {
  PartnerAuctionData: null,
  PartnerBidsData: null,
};
const partnerSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setPartnerAuctionData: (state, action) => {
      state.PartnerAuctionData = action.payload;
    },
    setPartnerBidsData: (state, action) => {
      state.PartnerBidsData = action.payload;
    },
  },
});

export const { setPartnerAuctionData, setPartnerBidsData } =
  partnerSlice.actions;
export default partnerSlice.reducer;
