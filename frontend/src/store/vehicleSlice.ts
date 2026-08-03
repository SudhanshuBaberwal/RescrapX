import { IVehicle } from "@/context/vehicleProvider";
import { createSlice } from "@reduxjs/toolkit";

interface VehicleState {
  vehicleData: IVehicle | null;
  allVehiclesData:[];
}

const initialState: VehicleState = {
  vehicleData: null,
  allVehiclesData:[]
};
const vehicleSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setVehicleData: (state, action) => {
      state.vehicleData = action.payload;
    },
    setAllVehiclesData : (state,action)=> {
      state.allVehiclesData = action.payload;
    }
  },
});

export const { setVehicleData , setAllVehiclesData } = vehicleSlice.actions;
export default vehicleSlice.reducer;
