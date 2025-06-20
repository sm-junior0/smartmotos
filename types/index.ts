export interface Location {
  latitude: number;
  longitude: number;
}

export * from './ride';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'rider' | 'driver';
  location?: Location;
}

export interface Driver extends User {
  role: 'driver';
  vehicle: Vehicle;
  isAvailable: boolean;
  rating: number;
  earnings: number;
  completedRides: number;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'motorcycle';
  make: string;
  model: string;
  year: number;
  plateNumber: string;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  pickup: Location;
  destination: Location;
  status: 'requested' | 'accepted' | 'started' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Payment {
  id: string;
  rideId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'card' | 'mobile_money' | 'paypal';
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ride' | 'payment' | 'promo' | 'system';
  read: boolean;
  createdAt: Date;
} 