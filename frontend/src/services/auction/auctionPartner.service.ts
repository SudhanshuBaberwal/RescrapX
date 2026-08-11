import api from "@/utils/api"

export const partnerAuctionData = async() => {
    try {
        const result = await api.get("/api/auction/partner/live")
        return result.data;
    } catch (error) {
        console.log(error)
    }
}