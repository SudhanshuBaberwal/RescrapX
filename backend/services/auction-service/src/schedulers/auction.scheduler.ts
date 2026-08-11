import cron from "node-cron";
import auctionRepository from "../repositories/auction.repository.js";

export const startAuctionScheduler = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      await auctionRepository.markAuctionsPendingApproval();

      await auctionRepository.startApprovedAuctions();
    } catch (error) {
      console.error(
        "Auction scheduler error:",
        error,
      );
    }
  });
};