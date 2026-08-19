import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(
      process.env.VITE_AUCTION_SOCKET_URL ||
        `${process.env.NEXT_PUBLIC_AUCTION_SOCKET_URL}`,
      {
        withCredentials: true,
        autoConnect: true,
      },
    );
  }

  return socket;
};
