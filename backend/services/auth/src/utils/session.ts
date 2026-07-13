import redis from "../config/redis.js";
import crypto from "crypto";

const SESSION_PREFIX = "session";

class SessionService {
  hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  async createSession(userId: string, sessionId: string, refreshToken: string) {
    const hashedToken = this.hashToken(refreshToken);
    await redis.set(`${SESSION_PREFIX}:${userId}:${sessionId}`, hashedToken, {
      EX: 60 * 60 * 24 * 7,
    });
  }

  async getSession(userId: string, sessionId: string) {
    return await redis.get(`${SESSION_PREFIX}:${userId}:${sessionId}`);
  }

  async deleteSession(userId: string, sessionId: string) {
    await redis.del(`${SESSION_PREFIX}:${userId}:${sessionId}`);
  }

  async verifySession(userId: string, sessionId: string, refreshToken: string) {
    const storedHash = await this.getSession(userId, sessionId);

    if (!storedHash) return false;

    return storedHash === this.hashToken(refreshToken);
  }
}

export default new SessionService();
