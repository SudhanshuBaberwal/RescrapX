import { getSocket } from "./socket";

export const joinAuction = (auctionId: string) => {
  const socket = getSocket();

  socket.emit("auction:join", auctionId);
};

export const leaveAuction = (auctionId: string) => {
  const socket = getSocket();

  socket.emit("auction:leave", auctionId);
};

export const onBidUpdated = (
  callback: (data: {
    auctionId: string;
    vehicleId: string;
    currentHighestBid: number;
    highestBidder: string | null;
    totalBids: number;
  }) => void,
) => {
  const socket = getSocket();

  socket.on("bid:updated", callback);

  return () => {
    socket.off("bid:updated", callback);
  };
};