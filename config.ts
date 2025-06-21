// API Configuration
export const API_URL = 'http://10.11.75.249:5000/api/';

// WebSocket Configuration
export const WS_URL = 'ws://10.11.75.249:5000/ws';

// Google Maps Configuration
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Flutterwave Configuration
export const FLUTTERWAVE_PUBLIC_KEY = process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '';

// App Configuration
export const APP_NAME = 'SmartMotos';
export const APP_VERSION = '1.0.0';

// Pricing Configuration
export const BASE_FARE = 500; // RWF
export const PER_KM_RATE = 30; // RWF
export const PLATFORM_FEE_PERCENTAGE = 4; // 4%

// Notification Configuration
export const NOTIFICATION_TIMEOUT = 30000; // 30 seconds
export const BOOKING_TIMEOUT = 30000; // 30 seconds

// Map Configuration
export const DEFAULT_LOCATION = {
  latitude: -1.9441,
  longitude: 30.0619,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  DRIVER_LOGIN: '/driver/login',
  DRIVER_REGISTER: '/driver/register',

  // Bookings
  CREATE_BOOKING: '/bookings/create',
  GET_BOOKINGS: '/bookings',
  UPDATE_BOOKING: '/bookings/update',

  // Payments
  PROCESS_PAYMENT: '/process-payment',
  DRIVER_EARNINGS: '/driver/earnings',
  REQUEST_WITHDRAWAL: '/driver/withdraw',

  // Notifications
  GET_NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: '/notifications/mark-read',
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/mark-all-read',
  SEND_NOTIFICATION: '/notifications/send',
  WEATHER_ALERT: '/notifications/weather-alert',

  // Demand
  UPDATE_DEMAND: '/demand/update',
  GET_DEMAND_ZONES: '/demand/zones',
  GET_NEARBY_DRIVERS: '/demand/nearby-drivers',
  UPDATE_DRIVER_LOCATION: '/driver/location/update',
} as const; 