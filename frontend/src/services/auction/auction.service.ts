import api from "@/utils/api";

export const createAuction = async (data: {
  startTime: string;
  endTime: string;
  visibility: "PUBLIC" | "PRIVATE";
  autoExtend: boolean;
}) => {
  try {
    const result = await api.post("/api/auction/create", data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAuctionDataService = async () => {
  try {
    const result = await api.get("/api/auction/auction");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const approveAuction = async (auctionId: string) => {
  try {
    const result = await api.post(
      `/api/auction/approve?auctionId=${auctionId}`,
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPendingStartApprovalAuctions = async () => {
  try {
    const response = await api.get("/api/auction/start-approval/pending");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const approveAuctionStart = async (auctionId: string) => {
  try {
    const response = await api.patch(
      `/api/auction/start-approval/approve?auctionId=${auctionId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const rejectAuctionStart = async (auctionId: string) => {
  try {
    const response = await api.patch(
      `/api/auction/start-approval/reject?auctionId=${auctionId}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
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
  try {
    const response = await api.get("/api/auction/admin/stats");

    return response.data?.data ?? response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch admin auction stats:",
      error?.response?.data || error
    );

    throw error;
  }
};


export const getAdminAuctionActivity = async () => {
  try {
    const response = await api.get("/api/auction/admin/activity");

    return response.data?.data ?? response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch admin auction activity:",
      error?.response?.data || error
    );

    throw error;
  }
};

export const getAdminAuctions = async () => {
  try {
    const response = await api.get("/api/auction/admin");

    return response.data?.data ?? response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch admin auctions:",
      error?.response?.data || error
    );

    throw error;
  }
};

export const getAdminAuctionById = async (auctionId: string) => {
  try {
    const response = await api.get(
      `/api/auction/admin/${auctionId}`
    );

    return response.data?.data ?? response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch admin auction:",
      error?.response?.data || error
    );

    throw error;
  }
};

export const cancelAdminAuction = async (
  auctionId: string,
  reason?: string
) => {
  try {
    const response = await api.patch(
      `/api/auction/admin/${auctionId}/cancel`,
      {
        reason: reason || "Cancelled by administrator",
      }
    );
    return response.data?.data ?? response.data;
  } catch (error: any) {
    console.error(
      "Failed to cancel auction:",
      error?.response?.data || error
    );

    throw error;
  }
};
