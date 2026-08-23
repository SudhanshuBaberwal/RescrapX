export interface PartnerAnalyticsSummary {
  totalVehiclesWon: number;
  totalSpend: number;
  totalEarnings: number;
  averageWinningMargin: number;
  totalPickups: number;
  totalRecycled: number;
}

export interface PerformancePoint {
  date: string;
  earnings: number;
  spend: number;
}

export interface VehiclesByStatus {
  won: number;
  processing: number;
  incoming: number;
  recycled: number;
  others: number;
  total?: number;
}

export interface EarningsTrendPoint {
  label: string;
  earnings: number;
}

export interface VehicleCategoryAnalytics {
  category: string;
  earnings: number;
  percentage: number;
}

export type InsightType =
  | "EARNINGS"
  | "WINNING_RATIO"
  | "PICKUP"
  | "DOCUMENT"
  | "GENERAL";

export interface AnalyticsInsight {
  type: InsightType;
  message: string;
}

export type RecentActivityType =
  | "PICKUP_COMPLETED"
  | "PAYMENT_RECEIVED"
  | "VEHICLE_WON"
  | "DOCUMENT_UPLOADED"
  | "VEHICLE_RECYCLED";

export interface RecentActivity {
  type: RecentActivityType;
  title: string;
  vehicleId?: string;
  orderId?: string;
  amount?: number;
  createdAt: string;
}

export interface PartnerAnalyticsData {
  summary: PartnerAnalyticsSummary;

  performanceOverview: PerformancePoint[];

  vehiclesByStatus: VehiclesByStatus;

  earningsTrend: EarningsTrendPoint[];

  topVehicleCategories: VehicleCategoryAnalytics[];

  keyInsights: AnalyticsInsight[];

  recentActivity: RecentActivity[];
}

export interface PartnerAnalyticsResponse {
  success: boolean;
  message: string;
  data: PartnerAnalyticsData;
}