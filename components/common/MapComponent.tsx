import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MarkerData {
    id: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    title?: string;
    description?: string;
    onPress?: () => void;
}

interface MapComponentProps {
  routeCoordinates: Coordinate[];
  currentLocation: Coordinate | null;
  markers?: MarkerData[];
}

const MapComponent = ({ routeCoordinates, currentLocation, markers }: MapComponentProps) => {
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
      {/* Blue route line */}
      <Polyline
        coordinates={routeCoordinates}
        strokeColor="#0066FF"
        strokeWidth={5}
      />
      
      {/* Driver marker */}
      {currentLocation && (
         <Marker coordinate={currentLocation}>
            <View style={styles.motorcycleMarker}>
              <FontAwesome name="motorcycle" size={20} color="#000" />
            </View>
          </Marker>
      )}

      {/* Custom markers passed as prop */}
      {markers && markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onPress={marker.onPress}
        >
          <View style={styles.locationMarker}>
            <Ionicons name="location" size={24} color="#00BCD4" />
          </View>
        </Marker>
      ))}
      
      {/* Remove old hardcoded markers */}
      {/*
      <Marker
        coordinate={routeCoordinates[1]}
      >
        <View style={styles.motorcycleMarker}>
          <FontAwesome name="motorcycle" size={20} color="#000" />
        </View>
      </Marker>
      
      <Marker
        coordinate={routeCoordinates[3]}
      >
        <View style={styles.locationMarker}>
          <Ionicons name="location" size={24} color="#00BCD4" />
        </View>
      </Marker>
      */}
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
});

export default MapComponent;