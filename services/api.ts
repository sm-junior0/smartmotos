import { API_URL, ENDPOINTS } from '../config';
import { Location, Payment, Notification } from '../types';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper function to get default headers
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export const apiService = {
  async get<T>(endpoint: string): Promise<T> {
    return fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    }).then(handleResponse<T>);
  },

  // Payment endpoints
  async processPayment(
    bookingId: string,
    amount: number,
    method: Payment['method']
  ): Promise<Payment> {
    return fetch(`${API_URL}${ENDPOINTS.PROCESS_PAYMENT}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        booking_id: bookingId,
        amount,
        method,
      }),
    }).then(handleResponse<Payment>);
  },

  async getDriverEarnings(driverId: string): Promise<{
    total: number;
    available: number;
    withdrawn: number;
  }> {
    return fetch(`${API_URL}${ENDPOINTS.DRIVER_EARNINGS}/${driverId}`, {
      headers: getHeaders(),
    }).then(handleResponse<{
      total: number;
      available: number;
      withdrawn: number;
    }>);
  },

  async requestWithdrawal(driverId: string, amount: number, method: string) {
    return fetch(`${API_URL}${ENDPOINTS.REQUEST_WITHDRAWAL}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        driver_id: driverId,
        amount,
        method,
      }),
    }).then(handleResponse);
  },

  async getPaymentHistory(rideId: string): Promise<Payment[]> {
    return fetch(`${API_URL}${ENDPOINTS.PROCESS_PAYMENT}/history/${rideId}`, {
      headers: getHeaders(),
    }).then(handleResponse<Payment[]>);
  },

  // Notification endpoints
  async sendNotification(
    userId: string,
    userType: string,
    title: string,
    message: string,
    type: Notification['type']
  ): Promise<Notification> {
    return fetch(`${API_URL}${ENDPOINTS.SEND_NOTIFICATION}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        user_id: userId,
        user_type: userType,
        title,
        message,
        type,
      }),
    }).then(handleResponse<Notification>);
  },

  async getNotifications(userType: string, userId: string): Promise<Notification[]> {
    return fetch(`${API_URL}${ENDPOINTS.GET_NOTIFICATIONS}/${userType}/${userId}`, {
      headers: getHeaders(),
    }).then(handleResponse<Notification[]>);
  },

  async markNotificationRead(notificationId: string) {
    return fetch(`${API_URL}${ENDPOINTS.MARK_NOTIFICATION_READ}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        notification_id: notificationId,
      }),
    }).then(handleResponse);
  },

  async markAllNotificationsRead(userId: string, userType: string) {
    return fetch(`${API_URL}${ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        user_id: userId,
        user_type: userType,
      }),
    }).then(handleResponse);
  },

  async sendWeatherAlert(driverId: string, condition: string, severity: string) {
    return fetch(`${API_URL}${ENDPOINTS.WEATHER_ALERT}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        driver_id: driverId,
        condition,
        severity,
      }),
    }).then(handleResponse);
  },

  // Demand tracking endpoints
  async getDemandZones() {
    return fetch(`${API_URL}${ENDPOINTS.GET_DEMAND_ZONES}`, {
      headers: getHeaders(),
    }).then(handleResponse);
  },

  async getNearbyDrivers(location: Location, radius?: number) {
    return fetch(`${API_URL}${ENDPOINTS.GET_NEARBY_DRIVERS}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
      }),
    }).then(handleResponse);
  },

  async updateDriverLocation(driverId: string, location: Location) {
    return fetch(`${API_URL}${ENDPOINTS.UPDATE_DRIVER_LOCATION}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        driver_id: driverId,
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    }).then(handleResponse);
  },
}; 