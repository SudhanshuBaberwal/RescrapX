import cron from "node-cron";

import auctionRepository from "../repositories/auction.repository.js";

import {
  emitApprovalRequired,
  emitAuctionStarted,
  emitAuctionEnded,
} from "../socket/auction.event.js";

// ======================================================
// REQUEST APPROVAL
// SCHEDULED -> APPROVAL_PENDING
// ======================================================

async function requestApproval(auctionId: string) {
  try {
    const auction =
      await auctionRepository.requestAuctionApproval(auctionId);

    if (!auction) {
      return;
    }

    console.log(`[AUCTION] Approval required: ${auctionId}`);

    emitApprovalRequired(auction);
  } catch (error) {
    console.error(
      `[AUCTION] Approval request failed: ${auctionId}`,
      error,
    );
  }
}

// ======================================================
// START AUCTION
// START_APPROVED -> LIVE
// ======================================================

async function startAuction(auctionId: string) {
  try {
    const auction =
      await auctionRepository.startApprovedAuction(auctionId);

    // Not approved OR start time not reached
    if (!auction) {
      return;
    }

    console.log(`[AUCTION] LIVE: ${auctionId}`);

    // Notify all connected partners immediately
    emitAuctionStarted(auction);
  } catch (error) {
    console.error(
      `[AUCTION] Start failed: ${auctionId}`,
      error,
    );
  }
}

// ======================================================
// END AUCTION
// LIVE -> ENDED
// + ASSIGN WINNERS
// ======================================================

async function endAuction(auctionId: string) {
  try {
    const auction =
      await auctionRepository.closeAuctionAndAssignWinners(auctionId);

    // Already closed / not live
    if (!auction) {
      return;
    }

    console.log(`[AUCTION] CLOSED: ${auctionId}`);

    const vehicles = auction.vehicles.map((vehicle) => ({
      vehicleId: vehicle.vehicleId,

      finalPrice: vehicle.currentHighestBid ?? 0,

      highestBidder: vehicle.highestBidder ?? null,

      assignedPartnerId: vehicle.assignedPartnerId ?? null,

      assignmentStatus: vehicle.assignedStatus,
    }));

    // Notify partners immediately
    emitAuctionEnded({
      auctionId,
      vehicles,
    });
  } catch (error) {
    console.error(
      `[AUCTION] Close failed: ${auctionId}`,
      error,
    );
  }
}

// ======================================================
// CHECK APPROVAL REQUESTS
// ======================================================

async function processApprovalRequests() {
  try {
    const auctions =
      await auctionRepository.findAuctionsRequiringApproval();

    for (const auction of auctions) {
      await requestApproval(auction._id.toString());
    }
  } catch (error) {
    console.error(
      "[AUCTION] Approval check failed:",
      error,
    );
  }
}

// ======================================================
// CHECK AUCTION STARTS
// ======================================================

async function processAuctionStarts() {
  try {
    const auctions =
      await auctionRepository.findAuctionsReadyToStart();

    for (const auction of auctions) {
      await startAuction(auction._id.toString());
    }
  } catch (error) {
    console.error(
      "[AUCTION] Start check failed:",
      error,
    );
  }
}

// ======================================================
// CHECK AUCTION ENDS
// ======================================================

async function processAuctionEnds() {
  try {
    const auctions =
      await auctionRepository.findExpiredAuctions();

    for (const auction of auctions) {
      await endAuction(auction._id.toString());
    }
  } catch (error) {
    console.error(
      "[AUCTION] End check failed:",
      error,
    );
  }
}

// ======================================================
// MAIN SCHEDULER
// ======================================================

let schedulerRunning = false;

export const startAuctionScheduler = () => {
  console.log("========================================");
  console.log("Auction scheduler started");
  console.log("========================================");

  // Check every second
  cron.schedule("* * * * * *", async () => {
    // Prevent overlapping scheduler executions
    if (schedulerRunning) {
      return;
    }

    schedulerRunning = true;

    try {
      // ------------------------------------------
      // 1. REQUEST APPROVAL
      // 3 minutes before startTime
      // ------------------------------------------

      await processApprovalRequests();

      // ------------------------------------------
      // 2. START AUCTION
      // Only if:
      // - Admin approved
      // - startTime has arrived
      // ------------------------------------------

      await processAuctionStarts();

      // ------------------------------------------
      // 3. END AUCTION
      // Only LIVE auctions whose endTime has passed
      // ------------------------------------------

      await processAuctionEnds();
    } finally {
      schedulerRunning = false;
    }
  });
};