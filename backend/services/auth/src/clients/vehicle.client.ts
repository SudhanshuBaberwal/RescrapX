import axios from "axios";
import { env } from "../config/env.js";

console.log("Base URL:", env.VEHICLE_SERVICE_URL);

const vehicleClient = axios.create({
  baseURL: env.VEHICLE_SERVICE_URL,
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default vehicleClient;
