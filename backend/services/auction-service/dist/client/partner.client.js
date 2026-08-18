import axios from "axios";
import { env } from "../config/env.js";
const partnerClient = axios.create({
    baseURL: env.PARTNER_SERVICE_URL,
    // timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});
export default partnerClient;
;
