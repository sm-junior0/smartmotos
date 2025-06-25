import { Location, Ride, Driver, RideStatus, User } from '../types';
import { MockGoogleServices } from './mockGoogleServices';
import { WS_URL } from '@/config';

class RideService {
  private static instance: RideService;
  private ws: WebSocket | null = null;
  private activeRides: Map<string, Ride>;
  private driverLocations: Map<string, Location>;
  private activeDrivers: Map<string, Driver>;
  private messageHandlers: Set<(data: any) => void>;
  private currentUser: User | null = null;
  private BASE_FARE = 5; // Base fare in currency units
  private COST_PER_KM = 1.5; // Cost per kilometer
  private COST_PER_MIN = 0.5; // Cost per minute
  private MAX_DRIVER_SEARCH_RADIUS = 5; // kilometers
  private isConnecting = false; // Prevent multiple simultaneous connections
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    this.activeRides = new Map();
    this.driverLocations = new Map();
    this.activeDrivers = new Map();
    this.messageHandlers = new Set();
  }

  private getCurrentUserId(): string {
    if (!this.currentUser) {
      throw new Error('No user is currently logged in');
    }
    return this.currentUser.id;
  }

  private isDriver(): boolean {
    if (!this.currentUser) {
      throw new Error('No user is currently logged in');
    }
    return this.currentUser.role === 'driver';
  }

  public setCurrentUser(user: User) {
    console.log('[RideService] setCurrentUser called with:', user);
    this.currentUser = user;
    this.reconnectAttempts = 0; // Reset reconnect attempts for new user
    this.setupWebSocket();
  }

  public setupWebSocketConnection() {
    console.log('[RideService] Manually setting up WebSocket connection');
    this.reconnectAttempts = 0; // Reset reconnect attempts
    this.setupWebSocket();
  }

  public resetConnection() {
    console.log('[RideService] Resetting WebSocket connection');
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setupWebSocket();
  }

  private setupWebSocket() {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      console.log('[WebSocket] Connection attempt already in progress, skipping...');
      return;
    }

    // If already connected, don't reconnect
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected, skipping setup');
      return;
    }

    // If we've exceeded max reconnect attempts, stop trying
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[WebSocket] Max reconnection attempts reached, stopping reconnection');
      return;
    }
    
    if (!this.currentUser) {
      console.warn('Cannot setup WebSocket without a user.');
      return;
    }

    this.isConnecting = true;
    this.reconnectAttempts++;

    const userId = this.getCurrentUserId();
    const userType = this.isDriver() ? 'driver' : 'passenger';
    
    const url = `${WS_URL}?user_id=${userId}&user_type=${userType}`;
    console.log(`[WebSocket] Connecting to: ${url}`);
    console.log(`[WebSocket] User ID: ${userId}, User Type: ${userType}`);
    console.log(`[WebSocket] Reconnect attempt: ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('[WebSocket] Connection established successfully');
      console.log(`[WebSocket] Connected as ${userType} with ID: ${userId}`);
      this.isConnecting = false;
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    };
    
    this.ws.onmessage = (event) => {
      console.log('[WebSocket] Message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] Parsed message data:', data);
        this.messageHandlers.forEach(handler => {
          console.log('[WebSocket] Calling message handler');
          handler(data);
        });
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      this.isConnecting = false;
    };
    
    this.ws.onclose = (event) => {
      console.warn('[WebSocket] Connection closed', event);
      console.log(`[WebSocket] Close code: ${event.code}, reason: ${event.reason}`);
      this.isConnecting = false;
      
      // Only attempt to reconnect if it wasn't a normal closure and we haven't exceeded max attempts
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`[WebSocket] Attempting to reconnect in 5 seconds... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => {
          this.setupWebSocket();
        }, 5000);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('[WebSocket] Max reconnection attempts reached, manual reconnection required');
      }
    };
  }

  public addMessageHandler(handler: (data: any) => void) {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: (data: any) => void) {
    this.messageHandlers.delete(handler);
  }

  private sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message - WebSocket not connected. State:', this.ws?.readyState);
    }
  }

  public isWebSocketConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  // Update driver's active status
  public async updateDriverStatus(driverId: string, isAvailable: boolean) {
    const driver = this.activeDrivers.get(driverId);
    if (driver) {
      driver.isAvailable = isAvailable;
      this.activeDrivers.set(driverId, driver);
      this.sendMessage({
        type: 'driver_status',
        driverId,
        isAvailable
      });
    }
  }

  private async updateDriverLocation(driverId: string, location: Location) {
    this.driverLocations.set(driverId, location);
    const driver = this.activeDrivers.get(driverId);
    if (driver) {
      driver.currentLocation = location;
      this.activeDrivers.set(driverId, driver);
      this.sendMessage({
        type: 'driver_location',
        driverId,
        location
      });
    }
  }

  // Get nearby available drivers
  public async getNearbyDrivers(location: Location): Promise<Driver[]> {
    const nearbyDrivers: Driver[] = [];
    
    for (const [driverId, driver] of this.activeDrivers.entries()) {
      if (driver.isAvailable && driver.currentLocation) {
        const distance = this.calculateDistance(location, driver.currentLocation);
        if (distance <= this.MAX_DRIVER_SEARCH_RADIUS) {
          nearbyDrivers.push(driver);
        }
      }
    }
    
    return nearbyDrivers.sort((a, b) => {
      if (!a.currentLocation || !b.currentLocation) return 0;
      const distA = this.calculateDistance(location, a.currentLocation);
      const distB = this.calculateDistance(location, b.currentLocation);
      return distA - distB;
    });
  }

  public async requestRide(
    riderId: string,
    pickup: Location,
    destination: Location
  ): Promise<Ride> {
    const route = await MockGoogleServices.calculateRoute(pickup, destination);
    const fare = await this.calculateFare(pickup, destination);

    const ride: Ride = {
      id: Math.random().toString(36).substr(2, 9),
      riderId,
      pickup,
      destination,
      status: 'requested',
      fare,
      distance: route.distance,
      duration: route.duration,
      createdAt: new Date()
    };

    this.activeRides.set(ride.id, ride);
    
    // Get and broadcast nearby drivers to rider
    const nearbyDrivers = await this.getNearbyDrivers(pickup);
    this.sendMessage({
      type: 'rider_notification',
      riderId,
      notificationType: 'nearby_drivers',
      data: nearbyDrivers
    });
    
    return ride;
  }

  // Handle rider selecting a specific driver
  public async handleDriverSelection(rideId: string, driverId: string) {
    const ride = this.activeRides.get(rideId);
    if (!ride) return;

    this.sendMessage({
      type: 'driver_notification',
      driverId,
      data: {
        type: 'ride_request',
        ride
      }
    });
  }

  public async handleDriverResponse(rideId: string, driverId: string, accepted: boolean) {
    const ride = this.activeRides.get(rideId);
    if (!ride) return;

    if (accepted) {
      ride.driverId = driverId;
      ride.status = 'driver_assigned';
      this.activeRides.set(rideId, ride);
      this.sendMessage({
        type: 'rider_notification',
        riderId: ride.riderId,
        notificationType: 'ride_accepted',
        data: ride
      });
    } else {
      this.sendMessage({
        type: 'rider_notification',
        riderId: ride.riderId,
        notificationType: 'driver_rejected',
        data: { rideId, driverId }
      });
    }
  }

  public async updateRideStatus(rideId: string, status: RideStatus) {
    const ride = this.activeRides.get(rideId);
    if (!ride) return;

    ride.status = status;
    
    switch (status) {
      case 'in_progress':
        ride.startedAt = new Date();
        break;
      case 'completed':
        ride.completedAt = new Date();
        break;
    }
    this.activeRides.set(rideId, ride);
    this.notifyRideUpdate(ride);
  }

  public async getRideDetails(rideId: string): Promise<Ride | null> {
    return this.activeRides.get(rideId) || null;
  }

  private async handlePayment(rideId: string, paymentMethod: string) {
    const ride = this.activeRides.get(rideId);
    if (!ride) return;

    ride.paymentMethod = paymentMethod;
    ride.status = 'paid';
    this.activeRides.set(rideId, ride);
    
    this.sendMessage({
      type: 'passenger_notification',
      passengerId: ride.riderId,
      notificationType: 'payment_completed',
      data: ride
    });

    if (ride.driverId) {
      this.sendMessage({
        type: 'driver_notification',
        driverId: ride.driverId,
        data: {
          type: 'payment_completed',
          ride
        }
      });
    }
  }

  private calculateDistance(point1: Location, point2: Location): number {
    const lat_diff = point2.latitude - point1.latitude;
    const lng_diff = point2.longitude - point1.longitude;
    return Math.sqrt(Math.pow(lat_diff, 2) + Math.pow(lng_diff, 2)) * 111; // Rough km calculation
  }

  public async calculateFare(pickup: Location, destination: Location): Promise<number> {
    const route = await MockGoogleServices.calculateRoute(pickup, destination);
    return this.BASE_FARE + 
           (this.COST_PER_KM * route.distance) + 
           (this.COST_PER_MIN * route.duration);
  }

  private notifyRideUpdate(ride: Ride) {
    // Notify both rider and driver of ride status update
    if (ride.riderId) {
      this.sendMessage({
        type: 'rider_notification',
        riderId: ride.riderId,
        notificationType: 'ride_update',
        data: ride
      });
    }
    if (ride.driverId) {
      this.sendMessage({
        type: 'driver_notification',
        driverId: ride.driverId,
        notificationType: 'ride_update',
        data: ride
      });
    }
  }
}

export const rideService = RideService.getInstance(); 