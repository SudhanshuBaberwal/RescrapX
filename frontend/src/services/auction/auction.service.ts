import api from "@/utils/api";

export const createAuction = async (data: {
  startTime: string;
  endTime: string;
  visibility: "PUBLIC" | "PRIVATE";
  autoExtend: boolean;
}) => {
  const result = await api.post("/api/auction/create", data);
  return result.data.data;
};

export const getAuctionDataService = async () => {
  const result = await api.get("/api/auction/auction");
  return result.data.data;
};

export const approveAuction = async (auctionId: string) => {
  const result = await api.post(`/api/auction/approve?auctionId=${auctionId}`);
  return result.data.data;
};

export const getPendingStartApprovalAuctions = async () => {
  const response = await api.get("/api/auction/start-approval/pending");
  return response.data.data;
};

export const approveAuctionStart = async (auctionId: string) => {
  const response = await api.patch(
    `/api/auction/start-approval/approve?auctionId=${auctionId}`,
  );
  return response.data.data;
};

export const rejectAuctionStart = async (auctionId: string) => {
  const response = await api.patch(
    `/api/auction/start-approval/reject?auctionId=${auctionId}`,
  );
  return response.data.data;
};

export interface AdminAuctionStats {
  liveAuctions: number;
  upcomingAuctions: number;
  completedToday: number;
  cancelled: number;
  averageBid: number;
  highestBidToday: number;
  highestBidVehicle?: string;
}

export interface AdminAuctionActivity {
  _id?: string;
  auctionId?: string;
  vehicleId?: string;
  partnerName?: string;
  companyName?: string;
  vehicleName?: string;
  bidAmount?: number;
  amount?: number;
  message?: string;
  createdAt: string;
  timestamp?: string;
}

export interface AdminAuctionVehicle {
  vehicleId: string;
  vehicle?: {
    _id?: string;
    vehicleDetails?: {
      manufacturer?: string;
      model?: string;
      manufacturingYear?: number;
      fuelType?: string;
      transmission?: string;
      registrationNumber?: string;
    };

    pickup?: {
      city?: string;
      state?: string;
      district?: string;
    };
  };

  minimumBid?: number;
  reservePrice?: number;
  bidIncrement?: number;

  currentHighestBid?: number;
  highestBidder?: string | null;
  totalBids?: number;

  assignedPartnerId?: string | null;
  assignedStatus?: string;
  winnerBid?: number | null;
}

export interface AdminAuction {
  _id: string;
  auctionId: string;

  type: string;
  status: string;
  visibility: string;

  startTime: string;
  endTime: string;

  totalBids: number;
  totalParticipants: number;

  vehicles: AdminAuctionVehicle[];

  partners?: {
    partnerId: string;
    companyName?: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

export const getAdminAuctionStats = async () => {
  const response = await api.get("/api/auction/admin/stats");
  return response.data?.data;
};

export const getAdminAuctionActivity = async () => {
  const response = await api.get("/api/auction/admin/activity");
  return response.data?.data ?? response.data;
};

export const getAdminAuctions = async () => {
  const response = await api.get("/api/auction/admin");
  return response.data?.data ?? response.data;
};

export const getAdminAuctionById = async (auctionId: string) => {
  const response = await api.get(`/api/auction/admin/${auctionId}`);

  return response.data?.data ?? response.data;
};

export const cancelAdminAuction = async (
  auctionId: string,
  reason?: string,
) => {
  const response = await api.patch(`/api/auction/admin/${auctionId}/cancel`, {
    reason: reason || "Cancelled by administrator",
  });
  return response.data?.data ?? response.data;
};
