// import { ComponentCondition } from "@/context/vehicleProvider";
// import api from "@/utils/api";

// export const createDraftVehicle = async () => {
//   try {
//     const result = await api.post("/api/vehicle/register");
//     return result.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const basicDetails = async (data: {
//   registrationNumber: number;
//   manufacturer: string;
//   model: string;
//   variant: string;
//   fuelType: string;
//   transmission: string;
//   manufacturingYear: number;
//   ownership: number;
//   kmsDriven: number;
// }) => {
//   try {
//     const result = await api.put("/api/vehicle/register/basic-details", data);
//     return result.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const vehicleCondition = async (data: {
//   accidentType: string;
//   structuralDamage: string;
//   airbagsDeployed: boolean;
//   description: string;
// }) => {
//   try {
//     const result = await api.put("/api/vehicle/register/vehicle-condition");
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const majorComponents = async (data: {
//   engine: ComponentCondition;
//   radiator: ComponentCondition;
//   fuelSystem: ComponentCondition;
//   gearbox: ComponentCondition;
//   suspension: ComponentCondition;
//   steering: ComponentCondition;
//   electrial: ComponentCondition;
//   exhaust: ComponentCondition;
//   tyres: ComponentCondition;
//   ac: ComponentCondition;
//   bodyPanels: ComponentCondition;
//   glass: ComponentCondition;
//   lights: ComponentCondition;
//   interior: ComponentCondition;
// }) => {
//   try {
//     const result = await api.put("/api/vehicle/register/major-components");
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const documents = async (data:{
//   rcbook:File,
//   loan_closure:File,
//   puc:File,
//   insurance:File,
//   other:File
// }) => {
//   try {
//     const result = await api.put("/api/vehicle/register/document");
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const photos = async (data : {
//   front:File,
//   rear:File,
//   left:File,
//   right:File,
//   dashboard:File,
//   interior:File,
//   engine:File,
//   odometer:File
// }) => {
//   try {
//     const result = await api.put("/api/vehicle/register/photos");
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const pickupLocation = async (data : {
//   houseNumber:string,
//   street:string,
//   area:string,
//   landmark:string,
//   city:string,
//   state:string,
//   pincode:string,
//   latitude:number,
//   longitude:number,
//   formattedAddress:string,
//   placeId:string,
//   contectName:string,
//   mobileNumber:string,
//   alternateNumber:string,
//   vehicleLocation:string,
//   towAccessibility:string,
//   currentVehiclePosition:string
// }) => {
//   try {
//     const result = await api.put("/api/vehicle/register/pickup-location");
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// };
