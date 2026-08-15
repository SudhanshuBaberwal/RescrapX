import {
  IAuction,
  MyBidStatus,
  WonVehicleDetails,
} from "@/context/auctionProvider";
import { IVehicle } from "@/context/vehicleProvider";
import { createSlice } from "@reduxjs/toolkit";

interface PartnerState {
  PartnerAuctionData: IAuction | null;
  PartnerBidsData: MyBidStatus | null;
  PartnerWonVehiclesdata: WonVehicleDetails | null;
  PartnerIncomingVehicleData: IVehicle[] | null;
}

const initialState: PartnerState = {
  PartnerAuctionData: null,
  PartnerBidsData: null,
  PartnerWonVehiclesdata: null,
  PartnerIncomingVehicleData: [],
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
    setPartnerWonVehiclesData: (state, action) => {
      state.PartnerWonVehiclesdata = action.payload;
    },
    setPartnerIncomingVehicleData: (state, action) => {
      state.PartnerIncomingVehicleData = action.payload;
    },
  },
});

export const {
  setPartnerAuctionData,
  setPartnerBidsData,
  setPartnerWonVehiclesData,
  setPartnerIncomingVehicleData,
} = partnerSlice.actions;
export default partnerSlice.reducer;
