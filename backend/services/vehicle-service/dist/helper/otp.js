import crypto from "crypto";
export function generatePickupOtp() {
    return crypto.randomInt(100000, 1000000).toString();
}
export function hashPickupOtp(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}
