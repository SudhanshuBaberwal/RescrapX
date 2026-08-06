export interface CreateAuctionDto {
  vehicleId: string;
  minimumBid: number;
  reservePrice: number;
  bidIncrement: number;
  startTime: Date;
  endTime: Date;
  visibility: "PUBLIC" | "PRIVATE";
  autoExtend: boolean;
}