import { Location, Ride, Driver } from '../types';
import { MockGoogleServices } from './mockGoogleServices';
import { WebSocket } from 'ws';
import { WebSocketServer as Server } from 'ws';

class RideService {
  private static instance: RideService;
  private wss!: Server;
  private activeRides: Map<string, Ride>;
  private driverLocations: Map<string, Location>;
  private BASE_FARE = 5; // Base fare in currency units
  private COST_PER_KM = 1.5; // Cost per kilometer
  private COST_PER_MIN = 0.5; // Cost per minute

  private constructor() {
    this.activeRides = new Map();
    this.driverLocations = new Map();
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss = new Server({ port: 8080 });
    
    this.wss.on('connection', (ws) => {
      ws.on('message', async (message) => {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'driver_location':
            await this.updateDriverLocation(data.driverId, data.location);
            break;
          case 'ride_request':
            await this.handleRideRequest(data.riderId, data.pickup, data.destination);
            break;
          case 'ride_response':
            await this.handleDriverResponse(data.rideId, data.driverId, data.accepted);
            break;
        }
      });
    });
  }

  public static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  private async updateDriverLocation(driverId: string, location: Location) {
    this.driverLocations.set(driverId, location);
    this.broadcastHighDemandAreas();
  }

  private async broadcastHighDemandAreas() {
    // Simple algorithm to determine high-demand areas
    const demandAreas = this.calculateHighDemandAreas();
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'high_demand_areas',
          areas: demandAreas
        }));
      }
    });
  }

  private calculateHighDemandAreas(): Location[] {
    // Simple mock implementation
    // In reality, this would analyze ride requests and driver positions
    return Array.from(this.activeRides.values())
      .filter(ride => ride.status === 'requested')
      .map(ride => ride.pickup);
  }

  public async calculateFare(pickup: Location, destination: Location): Promise<number> {
    const route = await MockGoogleServices.calculateRoute(pickup, destination);
    return this.BASE_FARE + 
           (this.COST_PER_KM * route.distance) + 
           (this.COST_PER_MIN * route.duration);
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
    await this.findNearbyDriver(ride);
    return ride;
  }

  private async findNearbyDriver(ride: Ride) {
    // Simple implementation to find the nearest driver
    let nearestDriver: { driverId: string; distance: number } | null = null;

    for (const [driverId, location] of this.driverLocations.entries()) {
      const distance = this.calculateDistance(location, ride.pickup);
      if (!nearestDriver || distance < nearestDriver.distance) {
        nearestDriver = { driverId, distance };
      }
    }

    if (nearestDriver) {
      this.notifyDriver(nearestDriver.driverId, ride);
    }
  }

  private calculateDistance(point1: Location, point2: Location): number {
    const lat_diff = point2.latitude - point1.latitude;
    const lng_diff = point2.longitude - point1.longitude;
    return Math.sqrt(Math.pow(lat_diff, 2) + Math.pow(lng_diff, 2)) * 111; // Rough km calculation
  }

  private notifyDriver(driverId: string, ride: Ride) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'ride_request',
          driverId,
          ride
        }));
      }
    });
  }

  private async handleRideRequest(riderId: string, pickup: Location, destination: Location) {
    await this.requestRide(riderId, pickup, destination);
  }

  private async handleDriverResponse(rideId: string, driverId: string, accepted: boolean) {
    const ride = this.activeRides.get(rideId);
    if (!ride) return;

    if (accepted) {
      ride.driverId = driverId;
      ride.status = 'accepted';
      this.activeRides.set(rideId, ride);
      this.notifyRider(ride.riderId, 'ride_accepted', ride);
    } else {
      await this.findNearbyDriver(ride);
    }
  }

  private notifyRider(riderId: string, type: string, data: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type,
          riderId,
          data
        }));
      }
    });
  }

  public async updateRideStatus(rideId: string, status: Ride['status']) {
    const ride = this.activeRides.get(rideId);
    if (!ride) return;

    ride.status = status;
    if (status === 'completed') {
      ride.completedAt = new Date();
    }

    this.activeRides.set(rideId, ride);
    this.notifyRideUpdate(ride);
  }

  private notifyRideUpdate(ride: Ride) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'ride_update',
          ride
        }));
      }
    });
  }
}

export const rideService = RideService.getInstance(); 