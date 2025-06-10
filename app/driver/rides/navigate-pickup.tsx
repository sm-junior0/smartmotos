import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import MapView from '@/components/common/MapView'; // Assuming MapView is a reusable component
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Star, Clock, MapPin } from 'lucide-react-native';

const RIDER_IMAGE =
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300';

// Define a type for ride request data (should match the one in index.tsx)
interface RideRequest {
    id: string;
    riderName: string;
    rating: number;
    fare: string;
    distance: string;
    pickup: string;
    dropoff: string;
    pickupCoords: { latitude: number; longitude: number };
    dropoffCoords: { latitude: number; longitude: number };
}

// Explicitly define MarkerData interface to match MapComponent's expectation
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

export default function NavigatePickupScreen() {
  const router = useRouter();
  const { rideData } = useLocalSearchParams();
  const [ride, setRide] = useState<RideRequest | null>(null);

  useEffect(() => {
      if (rideData) {
          try {
              const parsedRideData: RideRequest = JSON.parse(rideData as string);
              setRide(parsedRideData);
          } catch (error) {
              console.error('Failed to parse ride data:', error);
              // Optionally navigate back or show an error message
          }
      }
  }, [rideData]);

  const handleArrived = () => {
    if(ride) {
        // Navigate to the waiting screen, passing the ride data
        router.push({ pathname: '/driver/rides/waiting', params: { rideData: JSON.stringify(ride) } });
    }
  };

  if (!ride) {
      // Render a loading state or error message if ride data is not available
      return (
          <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading ride details...</Text>
          </View>
      );
  }

  // Create markers array explicitly typed as MarkerData[]
  const mapMarkers: MarkerData[] = [
    { // Marker for the pickup location
        id: 'pickup',
        coordinate: {
            latitude: ride.pickupCoords.latitude,
            longitude: ride.pickupCoords.longitude,
        },
        title: 'Pickup Location',
        description: ride.pickup,
    },
    // TODO: Add a marker for the driver's current location with a unique id
  ];

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ride.pickupCoords.latitude,
          longitude: ride.pickupCoords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        markers={mapMarkers}
        // TODO: Draw route line from current location to pickup
      />

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.riderInfo}>
          {/* Replace with actual rider image if available in ride data */}
          <Image source={{ uri: RIDER_IMAGE }} style={styles.riderImage} />
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>{ride.riderName}</Text>
            {/* TODO: Use actual rating from ride data if available */}
            <View style={styles.ratingContainer}>
              {[...Array(ride.rating)].map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  color={colors.primary.main}
                  fill={colors.primary.main}
                />
              ))}
               {[...Array(5 - ride.rating)].map((_, index) => (
                <Star
                  key={index+ride.rating}
                  size={16}
                  color={colors.primary.main}
                  fill={colors.background.paper}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Pickup</Text>
          <Text style={styles.locationText}>{ride.pickup}</Text>
          <Text style={styles.locationLabel}>Dropoff</Text>
          <Text style={styles.locationText}>{ride.dropoff}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.arrivedButton} onPress={handleArrived}>
          <Text style={styles.arrivedButtonText}>Arrived pickup location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.default,
  },
  loadingText: {
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.fontSize.md,
      color: colors.text.primary,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  riderImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  locationInfo: {
    marginBottom: spacing.xl,
  },
  locationLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  locationText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  arrivedButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  arrivedButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.primary.contrastText,
  },
}); 