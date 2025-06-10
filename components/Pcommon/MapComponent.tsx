import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  routeCoordinates: Coordinate[];
  availableRideLocations: { latitude: number; longitude: number }[];
  currentLocation: Coordinate | null;
}

const MapComponent = ({ routeCoordinates, currentLocation }: MapComponentProps) => {
  // Calculate midpoint of the route
  const getMidpoint = (coordinates: Coordinate[]): Coordinate | null => {
    if (coordinates.length < 2) return null;
    const midIndex = Math.floor(coordinates.length / 2);
    return coordinates[midIndex];
  };

  const midpoint = getMidpoint(routeCoordinates);

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentLocation?.latitude || -1.9440,
        longitude: currentLocation?.longitude || 30.0618,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* Blue route line (only render if routeCoordinates is non-empty) */}
      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#0066FF"
          strokeWidth={5}
        />
      )}
      {/* Driver marker (only render if routeCoordinates[1] exists) */}
      {routeCoordinates[1] && (
        <Marker coordinate={routeCoordinates[1]}>
          <View style={styles.motorcycleMarker}>
            <FontAwesome name="motorcycle" size={20} color="#000" />
          </View>
        </Marker>
      )}
      {/* Enroute marker at midpoint */}
      {midpoint && (
        <Marker coordinate={midpoint}>
          <View style={styles.enrouteMarker}>
            <MaterialIcons name="directions" size={24} color="#FF6B6B" />
          </View>
        </Marker>
      )}
      {/* Current location marker (only render if routeCoordinates[3] exists) */}
      {routeCoordinates[3] && (
        <Marker coordinate={routeCoordinates[3]}>
          <View style={styles.locationMarker}>
            <Ionicons name="location" size={24} color="#00BCD4" />
          </View>
        </Marker>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  motorcycleMarker: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    padding: 5,
  },
  locationMarker: {
    backgroundColor: 'transparent',
  },
  enrouteMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MapComponent;