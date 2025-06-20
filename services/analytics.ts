import { apiService } from './api';

export type Period = 'day' | 'week' | 'month' | 'year';

export interface EarningsAnalytics {
  earnings_by_date: {
    date: string;
    total_amount: number;
    total_commission: number;
    total_rides: number;
    net_earnings: number;
  }[];
  summary: {
    total_earnings: number;
    total_commission: number;
    total_rides: number;
    avg_earning_per_ride: number;
    period: Period;
  };
}

export interface DemandAnalytics {
  demand_zones: {
    latitude: number;
    longitude: number;
    demand_level: number;
    booking_count: number;
  }[];
  hourly_demand: {
    hour: number;
    booking_count: number;
  }[];
  period: Period;
}

export interface DriverAnalytics {
  drivers: {
    id: number;
    phone: string;
    total_rides: number;
    avg_fare: number;
    total_earnings: number;
    completed_rides: number;
    cancelled_rides: number;
    completion_rate: number;
  }[];
  period: Period;
}

export interface PlatformOverview {
  user_stats: {
    total_drivers: number;
    total_passengers: number;
    active_drivers: number;
  };
  booking_stats: {
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    completion_rate: number;
  };
  revenue_stats: {
    total_revenue: number;
    total_commission: number;
    net_revenue: number;
    avg_revenue_per_booking: number;
  };
  period: Period;
}

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public async getEarningsAnalytics(
    period: Period = 'week',
    driverId?: string
  ): Promise<EarningsAnalytics> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (driverId) {
      params.append('driver_id', driverId);
    }

    return apiService.get(`/analytics/earnings?${params.toString()}`);
  }

  public async getDemandAnalytics(period: Period = 'day'): Promise<DemandAnalytics> {
    return apiService.get(`/analytics/demand?period=${period}`);
  }

  public async getDriverAnalytics(
    period: Period = 'month',
    driverId?: string
  ): Promise<DriverAnalytics> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (driverId) {
      params.append('driver_id', driverId);
    }

    return apiService.get(`/analytics/drivers?${params.toString()}`);
  }

  public async getPlatformOverview(period: Period = 'month'): Promise<PlatformOverview> {
    return apiService.get(`/analytics/overview?period=${period}`);
  }

  // Helper methods for data processing
  public getEarningsTrend(data: EarningsAnalytics['earnings_by_date']) {
    return data.map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      earnings: day.net_earnings,
      rides: day.total_rides,
    }));
  }

  public getHourlyDemandData(data: DemandAnalytics['hourly_demand']) {
    return data.map(hour => ({
      hour: `${hour.hour}:00`,
      bookings: hour.booking_count,
    }));
  }

  public getDemandHeatmapData(data: DemandAnalytics['demand_zones']) {
    return data.map(zone => ({
      lat: zone.latitude,
      lng: zone.longitude,
      weight: zone.demand_level,
    }));
  }

  public getDriverPerformanceMetrics(data: DriverAnalytics['drivers'][0]) {
    return {
      completionRate: data.completion_rate.toFixed(1),
      avgFare: data.avg_fare.toFixed(0),
      totalEarnings: data.total_earnings.toFixed(0),
      totalRides: data.total_rides,
    };
  }

  public getRevenueMetrics(data: PlatformOverview['revenue_stats']) {
    return {
      totalRevenue: data.total_revenue.toFixed(0),
      netRevenue: data.net_revenue.toFixed(0),
      avgBookingValue: data.avg_revenue_per_booking.toFixed(0),
      commission: data.total_commission.toFixed(0),
    };
  }
}

export const analyticsService = AnalyticsService.getInstance(); 