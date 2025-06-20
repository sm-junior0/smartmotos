import { Payment } from '../types';
import { apiService } from './api';

class PaymentService {
  private static instance: PaymentService;
  private payments: Map<string, Payment>;
  private COMMISSION_RATE = 0.15; // 15% commission
  private MIN_WITHDRAWAL = 50; // Minimum withdrawal amount
  private driverBalances: Map<string, number>;

  private constructor() {
    this.payments = new Map();
    this.driverBalances = new Map();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public async processPayment(
    rideId: string,
    amount: number,
    method: Payment['method']
  ): Promise<Payment> {
    return apiService.processPayment(rideId, amount, method);
  }

  private async handleSuccessfulPayment(payment: Payment) {
    const ride = await this.getRideDetails(payment.rideId);
    if (!ride?.driverId) return;

    const commission = payment.amount * this.COMMISSION_RATE;
    const driverAmount = payment.amount - commission;

    // Update driver balance
    const currentBalance = this.driverBalances.get(ride.driverId) || 0;
    this.driverBalances.set(ride.driverId, currentBalance + driverAmount);
  }

  private async getRideDetails(rideId: string) {
    // This would normally fetch from a database
    // For now, we'll return a mock response
    return {
      id: rideId,
      driverId: 'mock-driver-id',
      // ... other ride details
    };
  }

  public async getDriverBalance(driverId: string): Promise<number> {
    const earnings = await apiService.getDriverEarnings(driverId) as {
      total: number;
      available: number;
      withdrawn: number;
    };
    return earnings.available;
  }

  public async requestWithdrawal(
    driverId: string,
    amount: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.requestWithdrawal(driverId, amount, 'mobile_money');
      return {
        success: true,
        message: 'Withdrawal processed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to process withdrawal'
      };
    }
  }

  public async getPaymentHistory(rideId: string): Promise<Payment[]> {
    return apiService.getPaymentHistory(rideId);
  }

  public async getDriverEarnings(driverId: string): Promise<{
    total: number;
    available: number;
    withdrawn: number;
  }> {
    return apiService.getDriverEarnings(driverId);
  }
}

export const paymentService = PaymentService.getInstance(); 