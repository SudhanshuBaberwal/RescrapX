"use client";

import { useEffect } from "react";
import {
  joinAuction,
  leaveAuction,
  onBidUpdated,
} from "./auction.event";

export const useAuctionSocket = (
  auctionId: string,
  onBidUpdate: (data: {
    auctionId: string;
    vehicleId: string;
    currentHighestBid: number;
    highestBidder: string | null;
    totalBids: number;
  }) => void,
) => {
  useEffect(() => {
    if (!auctionId) return;

    joinAuction(auctionId);

    const cleanup = onBidUpdated(onBidUpdate);

    return () => {
      cleanup();
      leaveAuction(auctionId);
    };
  }, [auctionId, onBidUpdate]);
};