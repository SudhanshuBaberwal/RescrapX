import {
  IAuction,
  MyBidStatus,
  WonVehicleDetails,
} from "@/context/auctionProvider";
import { IVehicle, PartnerDashboardResponse } from "@/context/vehicleProvider";
import { createSlice } from "@reduxjs/toolkit";

interface PartnerState {
  PartnerAuctionData: IAuction | null;
  PartnerBidsData: MyBidStatus | null;
  PartnerWonVehiclesdata: WonVehicleDetails | null;
  PartnerIncomingVehicleData: IVehicle[] | null;
  PartnerProcessingYardVehiclesData: IVehicle[] | null;
  PartnerDocumentUploadData: IVehicle[] | null;
  PartnerDashboardData: PartnerDashboardResponse | null;
  PartnerPaymentData: IVehicle | [];
}

const initialState: PartnerState = {
  PartnerAuctionData: null,
  PartnerBidsData: null,
  PartnerWonVehiclesdata: null,
  PartnerIncomingVehicleData: [],
  PartnerProcessingYardVehiclesData: [],
  PartnerDocumentUploadData: [],
  PartnerDashboardData: null,
  PartnerPaymentData: [],
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
    setPartnerProcessingYardData: (state, action) => {
      state.PartnerProcessingYardVehiclesData = action.payload;
    },
    setPartnerDocumentUploadData: (state, action) => {
      state.PartnerDocumentUploadData = action.payload;
    },
    setPartnerDashboardData: (state, action) => {
      state.PartnerDashboardData = action.payload;
    },
    setPartnerPaymentData: (state, action) => {
      state.PartnerPaymentData = action.payload;
    },
  },
});

export const {
  setPartnerAuctionData,
  setPartnerBidsData,
  setPartnerWonVehiclesData,
  setPartnerIncomingVehicleData,
  setPartnerProcessingYardData,
  setPartnerDocumentUploadData,
  setPartnerDashboardData,
  setPartnerPaymentData,
} = partnerSlice.actions;
export default partnerSlice.reducer;
