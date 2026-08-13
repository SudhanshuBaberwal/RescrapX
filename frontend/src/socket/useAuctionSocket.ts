"use client";

import { useEffect } from "react";
import { getSocket } from "./socket";
import {
  joinAuction,
  leaveAuction,
  onBidUpdated,
  onAuctionStarted,
  onAuctionEnded,
  BidUpdatedPayload,
  AuctionStartedPayload,
  AuctionEndedPayload,
} from "./auction.event";

export const useAuctionSocket = (
  auctionId?: string,
  onBidUpdate?: (data: BidUpdatedPayload) => void,
) => {
  const socket = getSocket();

  useEffect(() => {
    if (!auctionId) return;

    joinAuction(auctionId);

    const cleanupBid = onBidUpdate
      ? onBidUpdated(onBidUpdate)
      : undefined;

    return () => {
      cleanupBid?.();
      leaveAuction(auctionId);
    };
  }, [auctionId, onBidUpdate]);

  return socket;
};

// ==========================================
// AUCTION STARTED
// ==========================================

export const useAuctionStartedSocket = (
  onAuctionStartedCallback: (
    data: AuctionStartedPayload,
  ) => void,
) => {
  useEffect(() => {
    return onAuctionStarted(onAuctionStartedCallback);
  }, [onAuctionStartedCallback]);
};

// ==========================================
// AUCTION ENDED
// ==========================================

export const useAuctionEndedSocket = (
  onAuctionEndedCallback: (
    data: AuctionEndedPayload,
  ) => void,
) => {
  useEffect(() => {
    return onAuctionEnded(onAuctionEndedCallback);
  }, [onAuctionEndedCallback]);
};