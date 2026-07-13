import axios from "axios";
import { env } from "../config/env.js";

const notificationClient = axios.create({
  baseURL: env.NOTIFICATION_SERVICE_URL,
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default notificationClient;