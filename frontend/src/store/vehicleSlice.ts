import { IVehicle } from "@/context/vehicleProvider";
import { createSlice } from "@reduxjs/toolkit";

interface VehicleState {
  vehicleData: IVehicle | null;
}

const initialState: VehicleState = {
  vehicleData: null,
};
const vehicleSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setVehicleData: (state, action) => {
      state.vehicleData = action.payload;
    },
  },
});

export const { setVehicleData } = vehicleSlice.actions;
export default vehicleSlice.reducer;
