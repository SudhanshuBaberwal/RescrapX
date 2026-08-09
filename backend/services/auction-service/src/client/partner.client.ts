import axios from "axios";

export const partnerClient = {
  async getAuctionReadyPartners(token: string) {
    const response = await axios.get(
      `${process.env.PARTNER_SERVICE_URL}/api/partners/auction-ready`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  },
};