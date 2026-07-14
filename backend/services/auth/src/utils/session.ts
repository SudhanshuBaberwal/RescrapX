import redis from "../config/redis.js";
import crypto from "crypto";

const SESSION_PREFIX = "session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 Days

class SessionService {
  private getKey(userId: string, sessionId: string) {
    return `${SESSION_PREFIX}:${userId}:${sessionId}`;
  }

  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  async createSession(userId: string, sessionId: string, refreshToken: string) {
    const hashedToken = this.hashToken(refreshToken);

    await redis.set(this.getKey(userId, sessionId), hashedToken, {
      EX: SESSION_TTL,
    });
  }

  async getSession(userId: string, sessionId: string) {
    return redis.get(this.getKey(userId, sessionId));
  }

  async verifySession(userId: string, sessionId: string, refreshToken: string) {
    const storedHash = await this.getSession(userId, sessionId);

    if (!storedHash) {
      return false;
    }

    return storedHash === this.hashToken(refreshToken);
  }

  async updateSession(
    userId: string,
    sessionId: string,
    newRefreshToken: string,
  ) {
    const hashedToken = this.hashToken(newRefreshToken);

    await redis.set(this.getKey(userId, sessionId), hashedToken, {
      EX: SESSION_TTL,
    });
  }

  async deleteSession(userId: string, sessionId: string) {
    await redis.del(this.getKey(userId, sessionId));
  }

  async deleteAllSessions(userId: string) {
    const keys = await redis.keys(`${SESSION_PREFIX}:${userId}:*`);

    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}

export default new SessionService();