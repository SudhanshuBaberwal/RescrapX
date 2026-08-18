import axios from "axios";
import { env } from "../config/env.js";
const vehicleClient = axios.create({
    baseURL: env.VEHICLE_SERVICE_URL,
    // timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});
export default vehicleClient;
