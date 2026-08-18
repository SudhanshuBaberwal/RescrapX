import axios from "axios";
// Replace line 2 with:
import env from "../config/env.js";
export const getAdminDashboard = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const config = { headers: { Authorization: authHeader } };
        // Use Promise.allSettled so one failing endpoint (e.g. 404) doesn't reject the whole request
        const [auctionRes, vehicleStatsRes, vehiclePickupsRes] = await Promise.allSettled([
            axios.get(`${env.AUCTION_SERVICE_URL}/admin/dashboard`, config),
            axios.get(`${env.VEHICLE_SERVICE_URL}/admin/dashboard/stats`, config),
            axios.get(`${env.VEHICLE_SERVICE_URL}/admin/dashboard/pickups`, config),
        ]);
        // Safely extract data with default fallbacks
        const auctionData = auctionRes.status === "fulfilled" ? auctionRes.value.data?.data : {};
        const vehicleStatsData = vehicleStatsRes.status === "fulfilled" ? vehicleStatsRes.value.data?.data : {};
        const pickupData = vehiclePickupsRes.status === "fulfilled" ? vehiclePickupsRes.value.data?.data : {};
        // Log microservice errors to terminal for debugging
        if (auctionRes.status === "rejected")
            console.error("Auction Service Error:", auctionRes.reason?.message);
        if (vehicleStatsRes.status === "rejected")
            console.error("Vehicle Stats Error:", vehicleStatsRes.reason?.message);
        if (vehiclePickupsRes.status === "rejected")
            console.error("Vehicle Pickups Error:", vehiclePickupsRes.reason?.message);
        return res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully",
            data: {
                stats: {
                    totalVehicles: vehicleStatsData?.totalVehicles ?? 0,
                    biddingSessions: auctionData?.stats?.totalAuctions ?? 0,
                    activeBiddingSessions: auctionData?.stats?.liveAuctions ?? 0,
                    totalOrders: 0,
                    pickupsScheduled: pickupData?.scheduled ?? 0,
                    revenueToday: 0,
                    revenueMTD: 0,
                },
                biddingOverview: auctionData?.stats ?? {},
                liveAuctions: auctionData?.liveAuctions ?? [],
                pickupOverview: pickupData ?? {},
                pickupLocations: [],
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to aggregate admin dashboard data",
        });
    }
};
