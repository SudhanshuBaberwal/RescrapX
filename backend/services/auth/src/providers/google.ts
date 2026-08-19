import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

// Validate environment variables on startup
if (!env.GOOGLE_CLIENT_ID) {
  throw new Error("CRITICAL: GOOGLE_CLIENT_ID is missing from environment variables.");
}

const googleClient = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET, // optional depending on your flow type
});

export default googleClient;