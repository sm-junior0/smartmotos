import { API_URL } from '@/config';
import { notificationService } from './notification';
import * as SecureStore from 'expo-secure-store';

export interface BookingRequest {
  pickup_location: {
    lat: number;
    lng: number;
  };
  dropoff_location: {
    lat: number;
    lng: number;
  };
  pickup_time: string;
  payment_method: string;
  bargain_amount?: number;
}

export interface BookingResponse {
  booking_id: number;
  driver_id: number;
  fare: number;
  sub_total: number;
  app_fee: number;
  status: string;
  bargain_amount?: number;
}

class BookingService {
  private token: string | null = null;

  constructor() {
    // Initialize token when service is created
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        this.token = token;
      }
    } catch (error) {
      console.error('Error initializing token:', error);
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  private async getHeaders() {
    // If token is not set, try to get it from SecureStore
    if (!this.token) {
      await this.initializeToken();
    }
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  async createBooking(booking: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Booking API error:', response.status, errorText);
        throw new Error(`Failed to create booking: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Send notification to the assigned driver
      if (data.driver_id) {
        await notificationService.sendBookingNotification(
          data.driver_id.toString(),
          'driver',
          'new_booking',
          'You have a new ride request'
        );
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBooking(bookingId: number) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async getBookings() {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async acceptBooking(bookingId: number) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to accept booking');
      }

      const data = await response.json();

      // Send notification to passenger
      if (data.passenger_id) {
        await notificationService.sendBookingNotification(
          data.passenger_id.toString(),
          'passenger',
          'accepted',
          'Your ride has been accepted'
        );
      }

      return data;
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw error;
    }
  }

  async rejectBooking(bookingId: number) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }

      const data = await response.json();

      // Send notification to passenger
      if (data.passenger_id) {
        await notificationService.sendBookingNotification(
          data.passenger_id.toString(),
          'passenger',
          'rejected',
          'Your ride request was rejected'
        );
      }

      return data;
    } catch (error) {
      console.error('Error rejecting booking:', error);
      throw error;
    }
  }

  async startRide(bookingId: number) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/start`, {
        method: 'POST',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to start ride');
      }

      const data = await response.json();

      // Send notification to passenger
      if (data.passenger_id) {
        await notificationService.sendBookingNotification(
          data.passenger_id.toString(),
          'passenger',
          'started',
          'Your ride has started'
        );
      }

      return data;
    } catch (error) {
      console.error('Error starting ride:', error);
      throw error;
    }
  }

  async completeRide(bookingId: number) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: await this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to complete ride');
      }

      const data = await response.json();

      // Send notification to passenger
      if (data.passenger_id) {
        await notificationService.sendBookingNotification(
          data.passenger_id.toString(),
          'passenger',
          'completed',
          'Your ride has been completed'
        );
      }

      return data;
    } catch (error) {
      console.error('Error completing ride:', error);
      throw error;
    }
  }

  async updateDriverLocation(bookingId: number, location: { lat: number; lng: number }) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/location`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService(); 