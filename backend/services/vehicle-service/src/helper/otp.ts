import crypto from "crypto";

export function generatePickupOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashPickupOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
