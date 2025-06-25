import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useRide } from '../../hooks/useRideContext';
import { useAuth } from '../../hooks/AuthContext';
import { Ride, RideStatus } from '../../types';
import { API_URL } from '../../config';
import { getAuthToken } from '../../services/auth';
import MapComponent from '../../components/common/MapComponent';
import Button from '../../components/common/Button';

export default function ActiveRideScreen() {
  const { rideState } = useRide();
  const { user } = useAuth();
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus>('driver_assigned');

  useEffect(() => {
    // Initialize ride from context or fetch from API
    if (rideState.bookingDetails.bookingId) {
      fetchRideDetails(rideState.bookingDetails.bookingId);
    }
  }, []);

  const fetchRideDetails = async (bookingId: string) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (response.ok) {
        const bookingData = await response.json();
        console.log('[ActiveRide] Booking details:', bookingData);

        // Convert booking data to Ride format
        const ride: Ride = {
          id: bookingData.id,
          riderId: user?.id || '',
          driverId: bookingData.driver_id,
          pickup: {
            latitude: JSON.parse(bookingData.pickup_location).lat,
            longitude: JSON.parse(bookingData.pickup_location).lng,
            address: rideState.bookingDetails.pickup?.description || '',
          },
          destination: {
            latitude: JSON.parse(bookingData.dropoff_location).lat,
            longitude: JSON.parse(bookingData.dropoff_location).lng,
            address: rideState.bookingDetails.dropoff?.description || '',
          },
          status: bookingData.status as RideStatus,
          fare: bookingData.fare,
          distance: rideState.bookingDetails.distance || 0,
          duration: rideState.bookingDetails.duration || 0,
          createdAt: new Date(bookingData.booking_time),
        };

        setCurrentRide(ride);
        setRideStatus(ride.status);

        // Fetch driver info
        if (bookingData.driver_id) {
          fetchDriverInfo(bookingData.driver_id);
        }
      }
    } catch (error) {
      console.error('[ActiveRide] Error fetching ride details:', error);
    }
  };

  const fetchDriverInfo = async (driverId: string) => {
    try {
      const response = await fetch(`${API_URL}/driver/${driverId}`, {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (response.ok) {
        const driverData = await response.json();
        setDriverInfo(driverData);
      }
    } catch (error) {
      console.error('[ActiveRide] Error fetching driver info:', error);
    }
  };

  const handleStartRide = async () => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${currentRide?.id}/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setRideStatus('in_progress');
        Alert.alert('Ride Started', 'Your ride is now in progress!');
      } else {
        Alert.alert('Error', 'Failed to start ride');
      }
    } catch (error) {
      console.error('[ActiveRide] Error starting ride:', error);
      Alert.alert('Error', 'Failed to start ride');
    }
  };

  const handlePauseRide = async () => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${currentRide?.id}/pause`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setRideStatus('paused');
        Alert.alert('Ride Paused', 'Your ride has been paused.');
      } else {
        Alert.alert('Error', 'Failed to pause ride');
      }
    } catch (error) {
      console.error('[ActiveRide] Error pausing ride:', error);
      Alert.alert('Error', 'Failed to pause ride');
    }
  };

  const handleResumeRide = async () => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${currentRide?.id}/resume`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setRideStatus('in_progress');
        Alert.alert('Ride Resumed', 'Your ride has been resumed.');
      } else {
        Alert.alert('Error', 'Failed to resume ride');
      }
    } catch (error) {
      console.error('[ActiveRide] Error resuming ride:', error);
      Alert.alert('Error', 'Failed to resume ride');
    }
  };

  const handleCompleteRide = async () => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${currentRide?.id}/complete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setRideStatus('completed');
        Alert.alert('Ride Completed', 'Your ride has been completed!');
        // Navigate to payment screen
        router.push('/Ride/payment');
      } else {
        Alert.alert('Error', 'Failed to complete ride');
      }
    } catch (error) {
      console.error('[ActiveRide] Error completing ride:', error);
      Alert.alert('Error', 'Failed to complete ride');
    }
  };

  const handleCancelRide = async () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(
              `${API_URL}/bookings/${currentRide?.id}/cancel`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${await getAuthToken()}`,
                },
              }
            );

            if (response.ok) {
              setRideStatus('cancelled');
              Alert.alert('Ride Cancelled', 'Your ride has been cancelled.');
              router.back();
            } else {
              Alert.alert('Error', 'Failed to cancel ride');
            }
          } catch (error) {
            console.error('[ActiveRide] Error cancelling ride:', error);
            Alert.alert('Error', 'Failed to cancel ride');
          }
        },
      },
    ]);
  };

  if (!currentRide) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </SafeAreaView>
    );
  }

  const routeCoordinates = [currentRide.pickup, currentRide.destination];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Ride</Text>
        <Text style={styles.statusText}>
          Status: {rideStatus.replace('_', ' ')}
        </Text>
      </View>

      <MapComponent
        routeCoordinates={routeCoordinates}
        currentLocation={currentRide.pickup}
        markers={[]}
      />

      <View style={styles.rideInfo}>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverInfo?.name || 'Driver'}</Text>
          <Text style={styles.vehicleInfo}>
            {driverInfo?.vehicle_type || 'Vehicle'} -{' '}
            {driverInfo?.license_number || 'Plate'}
          </Text>
          <Text style={styles.phoneInfo}>{driverInfo?.phone || 'Phone'}</Text>
        </View>

        <View style={styles.rideDetails}>
          <Text style={styles.locationText}>
            From: {currentRide.pickup.address}
          </Text>
          <Text style={styles.locationText}>
            To: {currentRide.destination.address}
          </Text>
          <Text style={styles.fareText}>
            Fare: ${currentRide.fare.toFixed(2)}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {rideStatus === 'driver_assigned' && (
            <>
              <Button
                text="Start Ride"
                onPress={handleStartRide}
                variant="primary"
              />
              <Button
                text="Cancel Ride"
                onPress={handleCancelRide}
                variant="outline"
              />
            </>
          )}

          {rideStatus === 'in_progress' && (
            <>
              <Button
                text="Pause Ride"
                onPress={handlePauseRide}
                variant="primary"
              />
              <Button
                text="Complete Ride"
                onPress={handleCompleteRide}
                variant="primary"
              />
            </>
          )}

          {rideStatus === 'paused' && (
            <>
              <Button
                text="Resume Ride"
                onPress={handleResumeRide}
                variant="primary"
              />
              <Button
                text="Complete Ride"
                onPress={handleCompleteRide}
                variant="primary"
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  rideInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  driverInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phoneInfo: {
    fontSize: 14,
    color: '#666',
  },
  rideDetails: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  fareText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionButtons: {
    gap: 12,
  },
});
