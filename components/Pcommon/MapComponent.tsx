import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Navigation } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface MapComponentProps {
  userLocation: { latitude: number; longitude: number } | null;
  pickupLocation?: string;
  dropoffLocation?: string;
  polyline?: string;
  driverLocation?: { latitude: number; longitude: number };
}

export default function MapComponent({
  userLocation,
  pickupLocation,
  dropoffLocation,
  polyline,
  driverLocation,
}: MapComponentProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [userLocation]);

  useEffect(() => {
    if (mapRef.current && polyline) {
      // Convert polyline string to coordinates
      const points = polyline.split('|').map((point) => {
        const [lat, lng] = point.split(',').map(Number);
        return { latitude: lat, longitude: lng };
      });

      // Fit map to show all points
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [polyline]);

  const renderPolyline = () => {
    if (!polyline) return null;

    const points = polyline.split('|').map((point) => {
      const [lat, lng] = point.split(',').map(Number);
      return { latitude: lat, longitude: lng };
    });

    return (
      <Polyline
        coordinates={points}
        strokeColor={Colors.primary.default}
        strokeWidth={3}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -1.9534,
          longitude: 30.0944,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userMarker}>
              <MapPin size={24} color={Colors.primary.default} />
            </View>
          </Marker>
        )}

        {driverLocation && (
          <Marker coordinate={driverLocation}>
            <View style={styles.driverMarker}>
              <Navigation size={24} color={Colors.primary.default} />
            </View>
          </Marker>
        )}

        {renderPolyline()}
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
    padding: 8,
    backgroundColor: Colors.neutral.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary.default,
  },
  driverMarker: {
    padding: 8,
    backgroundColor: Colors.neutral.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary.default,
  },
});
