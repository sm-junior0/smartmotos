import { Location } from '../types';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Route {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  polyline: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  location: LatLng;
}

// Mock data for location suggestions
const mockLocations = [
  { id: '1', name: 'Central Park', lat: 40.7829, lng: -73.9654 },
  { id: '2', name: 'Times Square', lat: 40.7580, lng: -73.9855 },
  { id: '3', name: 'Empire State Building', lat: 40.7484, lng: -73.9857 },
];

export class MockGoogleServices {
  // Mock data for places
  private places: Place[] = [
    {
      id: '1',
      name: 'Kigali Convention Centre',
      address: 'KG 2 Roundabout, Kigali, Rwanda',
      location: { lat: -1.9534, lng: 30.0944 },
    },
    {
      id: '2',
      name: 'Kigali International Airport',
      address: 'KG 9 Ave, Kigali, Rwanda',
      location: { lat: -1.9686, lng: 30.1346 },
    },
    {
      id: '3',
      name: 'Nyabugogo Bus Station',
      address: 'KN 7 Rd, Kigali, Rwanda',
      location: { lat: -1.9397, lng: 30.0557 },
    },
    {
      id: '4',
      name: 'Kigali Heights',
      address: 'KG 7 Ave, Kigali, Rwanda',
      location: { lat: -1.9542, lng: 30.0931 },
    },
  ];

  // Simulates Google Places Autocomplete
  async searchPlaces(query: string): Promise<Place[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return filtered places based on query
    return this.places.filter(
      place =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.address.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Simulates Geocoding
  async getPlaceDetails(placeId: string): Promise<Place | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return this.places.find(place => place.id === placeId) || null;
  }

  // Simulates Route calculation
  async getRoute(origin: LatLng, destination: LatLng): Promise<Route> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));

    // Calculate mock distance and duration
    const lat1 = origin.lat;
    const lon1 = origin.lng;
    const lat2 = destination.lat;
    const lon2 = destination.lng;

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Mock duration (assume average speed of 30 km/h)
    const duration = (distance / 30) * 3600; // Convert to seconds

    return {
      distance: {
        text: `${distance.toFixed(1)} km`,
        value: distance * 1000, // Convert to meters
      },
      duration: {
        text: `${Math.round(duration / 60)} mins`,
        value: Math.round(duration),
      },
      polyline: this.generateMockPolyline(origin, destination),
    };
  }

  async getCurrentLocation(): Promise<LatLng> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return a default location in Kigali
    return { lat: -1.9534, lng: 30.0944 };
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private generateMockPolyline(start: LatLng, end: LatLng): string {
    // Generate a simple straight line between points
    // In reality, you would use the actual Google Maps Polyline encoding algorithm
    const points = [
      start,
      { lat: (start.lat + end.lat) / 2, lng: (start.lng + end.lng) / 2 },
      end,
    ];
    return points
      .map(point => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`)
      .join('|');
  }
}

export const mockGoogleServices = new MockGoogleServices(); 