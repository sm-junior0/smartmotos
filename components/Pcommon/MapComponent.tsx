import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Car, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AvailableRide, DriverInfo } from '@/hooks/useRideContext';

interface MapComponentProps {
  userLocation: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number } | null;
  nearbyDrivers?: AvailableRide[];
  assignedDriver?: DriverInfo | null;
  routePolyline?: string | null;
}

export default function MapComponent({
  userLocation,
  destination,
  nearbyDrivers = [],
  assignedDriver,
  routePolyline,
}: MapComponentProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && userLocation && destination) {
      const coordinates = [userLocation, destination];
      if (assignedDriver?.location) {
        coordinates.push(assignedDriver.location);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
        animated: true,
      });
    } else if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [userLocation, destination, assignedDriver]);

  const decodePolyline = (polyline: string) => {
    // This is a placeholder. A real app would use a library like @mapbox/polyline
    // to decode the polyline string from Google Directions API.
    // For now, assuming a simple format for the mock service.
    if (!polyline) return [];
    try {
      return polyline.split('|').map((point) => {
        const [lat, lng] = point.split(',').map(Number);
        return { latitude: lat, longitude: lng };
      });
    } catch (e) {
      console.error('Error decoding polyline:', e);
      return [];
    }
  };

  const polylineCoordinates = routePolyline
    ? decodePolyline(routePolyline)
    : [];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          userLocation
            ? { ...userLocation, latitudeDelta: 0.09, longitudeDelta: 0.04 }
            : undefined
        }
      >
        {/* User's Location Marker */}
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <View style={styles.userMarker}>
              <MapPin size={24} color={Colors.primary.default} />
            </View>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker coordinate={destination} title="Destination">
            <View style={styles.destinationMarker}>
              <MapPin size={24} color={Colors.secondary.default} />
            </View>
          </Marker>
        )}

        {/* Nearby Drivers Markers */}
        {nearbyDrivers
          .filter(
            (driver) =>
              driver.location &&
              typeof driver.location.latitude === 'number' &&
              typeof driver.location.longitude === 'number'
          )
          .map((driver) => (
            <Marker key={driver.id} coordinate={driver.location}>
              <View style={styles.driverMarker}>
                <Car size={22} color={Colors.neutral.white} />
              </View>
            </Marker>
          ))}

        {/* Assigned Driver Marker (highlighted) */}
        {assignedDriver?.location && (
          <Marker coordinate={assignedDriver.location} title="Your Driver">
            <View style={styles.assignedDriverMarker}>
              <Car size={24} color={Colors.neutral.white} />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {polylineCoordinates.length > 0 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor={Colors.primary.default}
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    backgroundColor: Colors.neutral.white,
    padding: 8,
    borderRadius: 24,
    borderColor: Colors.primary.default,
    borderWidth: 3,
  },
  destinationMarker: {
    backgroundColor: Colors.neutral.white,
    padding: 8,
    borderRadius: 24,
    borderColor: Colors.secondary.default,
    borderWidth: 3,
  },
  driverMarker: {
    backgroundColor: Colors.neutral.dark,
    padding: 6,
    borderRadius: 18,
  },
  assignedDriverMarker: {
    backgroundColor: Colors.primary.default,
    padding: 8,
    borderRadius: 24,
    borderColor: Colors.neutral.white,
    borderWidth: 2,
  },
});
