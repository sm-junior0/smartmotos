import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapComponent from '@/components/common/MapComponent';
import { colors } from '@/styles/theme';
import { spacing, typography, borderRadius } from '@/styles/theme';
import { API_URL } from '@/config';
import { getAuthToken } from '@/services/auth';
import * as Location from 'expo-location';

interface RideData {
  id: string;
  riderName: string;
  rating: number;
  fare: string;
  distance: string;
  pickup: string;
  dropoff: string;
  pickupCoords: { latitude: number; longitude: number };
  dropoffCoords: { latitude: number; longitude: number };
  passenger_id: number;
  booking_id: number;
}

export default function NavigatePickupScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [rideData, setRideData] = useState<RideData | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [rideStatus, setRideStatus] = useState<
    'navigating' | 'arrived' | 'started' | 'completed'
  >('navigating');
  const [isAtPickup, setIsAtPickup] = useState(false);

  useEffect(() => {
    if (params.rideData) {
      try {
        const parsedRideData = JSON.parse(params.rideData as string);
        setRideData(parsedRideData);
      } catch (error) {
        console.error('Error parsing ride data:', error);
        Alert.alert('Error', 'Invalid ride data');
        router.back();
      }
    }

    // Get current location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, [params.rideData]);

  // Check if driver is at pickup location
  useEffect(() => {
    if (rideData && currentLocation) {
      const distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        rideData.pickupCoords.latitude,
        rideData.pickupCoords.longitude
      );

      // If within 100 meters of pickup location
      if (distance <= 0.1) {
        setIsAtPickup(true);
        if (rideStatus === 'navigating') {
          setRideStatus('arrived');
        }
      } else {
        setIsAtPickup(false);
      }
    }
  }, [currentLocation, rideData, rideStatus]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleStartRide = async () => {
    if (!rideData) return;

    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_URL}/bookings/${rideData.booking_id}/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setRideStatus('started');
        Alert.alert('Ride Started', 'Your ride is now in progress!');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to start ride');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Error', 'Failed to start ride');
    }
  };

  const handleCompleteRide = async () => {
    if (!rideData) return;

    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_URL}/bookings/${rideData.booking_id}/complete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setRideStatus('completed');
        Alert.alert('Ride Completed', 'Your ride has been completed!');
        // Navigate to payment screen or back to rides
        router.push('/driver/rides');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to complete ride');
      }
    } catch (error) {
      console.error('Error completing ride:', error);
      Alert.alert('Error', 'Failed to complete ride');
    }
  };

  const handleCancelRide = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          if (!rideData) return;

          try {
            const token = await getAuthToken();
            const response = await fetch(
              `${API_URL}/bookings/${rideData.booking_id}/cancel`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              Alert.alert('Ride Cancelled', 'The ride has been cancelled');
              router.push('/driver/rides');
            } else {
              const errorData = await response.json();
              Alert.alert('Error', errorData.error || 'Failed to cancel ride');
            }
          } catch (error) {
            console.error('Error cancelling ride:', error);
            Alert.alert('Error', 'Failed to cancel ride');
          }
        },
      },
    ]);
  };

  if (!rideData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading ride data...</Text>
      </SafeAreaView>
    );
  }

  const routeCoordinates = [
    currentLocation?.coords
      ? {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }
      : rideData.pickupCoords,
    rideData.pickupCoords,
    rideData.dropoffCoords,
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <MapComponent
        routeCoordinates={routeCoordinates}
        currentLocation={
          currentLocation?.coords
            ? {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }
            : null
        }
        markers={[
          {
            id: 'pickup',
            coordinate: rideData.pickupCoords,
            title: 'Pickup Location',
            description: rideData.pickup,
          },
          {
            id: 'dropoff',
            coordinate: rideData.dropoffCoords,
            title: 'Dropoff Location',
            description: rideData.dropoff,
          },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {rideStatus === 'navigating'
            ? 'Navigate to Pickup'
            : rideStatus === 'arrived'
            ? 'Arrived at Pickup'
            : rideStatus === 'started'
            ? 'Ride in Progress'
            : 'Ride Completed'}
        </Text>
      </View>

      {/* Ride Info Card */}
      <View style={styles.rideInfoCard}>
        <View style={styles.riderInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>{rideData.riderName}</Text>
            <Text style={styles.rideStatus}>
              {rideStatus === 'navigating'
                ? 'Heading to pickup...'
                : rideStatus === 'arrived'
                ? 'Waiting for passenger'
                : rideStatus === 'started'
                ? 'Ride in progress'
                : 'Ride completed'}
            </Text>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{rideData.pickup}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.text.secondary}
            />
            <Text style={styles.detailText}>{rideData.dropoff}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{rideData.fare}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {rideStatus === 'navigating' && (
            <Text style={styles.statusText}>
              {isAtPickup
                ? 'You have arrived at pickup location'
                : 'Navigate to pickup location'}
            </Text>
          )}

          {rideStatus === 'arrived' && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartRide}
            >
              <Text style={styles.startButtonText}>Start Ride</Text>
            </TouchableOpacity>
          )}

          {rideStatus === 'started' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteRide}
            >
              <Text style={styles.completeButtonText}>Complete Ride</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRide}
          >
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  rideInfoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  rideStatus: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  rideDetails: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailText: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  actionButtons: {
    gap: spacing.md,
  },
  statusText: {
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    paddingVertical: spacing.sm,
  },
  startButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.primary.contrastText,
  },
  completeButton: {
    backgroundColor: colors.success.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  completeButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.success.contrastText,
  },
  cancelButton: {
    backgroundColor: colors.error.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.error.contrastText,
  },
});
