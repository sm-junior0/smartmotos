import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MapComponent from '../../components/common/MapComponent';
import { RideStatusCard } from '../../components/common/RideStatusCard';
import { Driver, Ride, Location, MarkerData } from '../../types';
import { rideService } from '../../services/ride';
import { useRide, LocationDetails } from '../../hooks/useRideContext';
import { useAuth } from '../../hooks/AuthContext';
import { API_URL } from '../../config';
import { getAuthToken } from '../../services/auth';

// Custom hook to wait for driver acceptance (WebSocket + polling fallback)
function useWaitForDriverAcceptance(
  rideId: string | number | undefined,
  onAccepted: (ride: any) => void,
  onRejected: () => void
) {
  useEffect(() => {
    if (!rideId) return;
    let polling: ReturnType<typeof setInterval> | null = null;
    let isActive = true;

    // Handler for WebSocket events
    const handleMessage = (data: any) => {
      if (data.type === 'ride_accepted' && data.data?.id === rideId) {
        if (isActive) {
          onAccepted(data.data);
        }
      } else if (data.type === 'driver_rejected' && data.data?.id === rideId) {
        if (isActive) {
          onRejected();
        }
      }
    };
    rideService.addMessageHandler(handleMessage);

    // Polling fallback
    const poll = async () => {
      try {
        const token = await getAuthToken();
        const res = await fetch(`${API_URL}/bookings/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const ride = await res.json();
          if (ride.status === 'accepted') {
            if (isActive) onAccepted(ride);
          } else if (ride.status === 'rejected') {
            if (isActive) onRejected();
          }
        }
      } catch (e) {
        // Ignore errors
      }
    };
    polling = setInterval(poll, 3000);

    return () => {
      isActive = false;
      rideService.removeMessageHandler(handleMessage);
      if (polling) clearInterval(polling);
    };
  }, [rideId, onAccepted, onRejected]);
}

export default function RideConfirmation() {
  const router = useRouter();
  const { rideState, updateBookingDetails } = useRide();
  const { user } = useAuth();
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);
  const [pollingInterval, setPollingInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  // console.log(
  //   'RideConfirmation render: currentRide =',
  //   currentRide,
  //   'nearbyDrivers =',
  //   nearbyDrivers,
  //   'user =',
  //   user
  // );

  // Ensure ride service is set up with current user
  useEffect(() => {
    if (user) {
      // console.log(
      //   '[RideConfirmation] Setting up ride service with user:',
      //   user
      // );
      // Map 'passenger' role to 'rider' for the ride service
      const rideServiceUser = {
        ...user,
        role: 'rider' as const,
      };
      rideService.setCurrentUser(rideServiceUser);
    }
  }, [user]);

  useEffect(() => {
    // Create initial ride from booking details
    const initializeRide = async () => {
      const pickup = rideState.bookingDetails.pickup;
      const dropoff = rideState.bookingDetails.dropoff;

      // console.log(
      //   'Initializing ride with booking details:',
      //   rideState.bookingDetails
      // );

      if (pickup && dropoff) {
        try {
          const pickupLocation: Location = {
            latitude: pickup.coords.lat,
            longitude: pickup.coords.lng,
            address: pickup.description,
          };

          const destinationLocation: Location = {
            latitude: dropoff.coords.lat,
            longitude: dropoff.coords.lng,
            address: dropoff.description,
          };

          const ride = await rideService.requestRide(
            'rider-123', // TODO: Get from auth context
            pickupLocation,
            destinationLocation
          );
          // console.log('Ride initialized:', ride);
          setCurrentRide(ride);
          setRouteCoordinates([pickupLocation, destinationLocation]);
        } catch (error) {
          Alert.alert('Error', 'Failed to initialize ride');
          router.replace('/Ride');
        }
      } else {
        router.replace('/Ride');
      }
    };

    initializeRide();
  }, []);

  useEffect(() => {
    if (!currentRide) return;

    const handleMessage = (data: any) => {
      // console.log('[RideConfirmation] WebSocket message received:', data);
      // console.log('[RideConfirmation] Current ride ID:', currentRide.id);
      // console.log('[RideConfirmation] Message type:', data.type);
      // console.log('[RideConfirmation] Message riderId:', data.riderId);
      // console.log(
      //   '[RideConfirmation] Current ride riderId:',
      //   currentRide.riderId
      // );

      if (
        data.type === 'rider_notification' &&
        data.riderId === currentRide.riderId
      ) {
        // console.log(
        //   '[RideConfirmation] Processing rider notification:',
        //   data.notificationType
        // );
        switch (data.notificationType) {
          case 'nearby_drivers':
            // console.log(
            //   '[RideConfirmation] Processing nearby_drivers notification'
            // );
            // console.log('[RideConfirmation] Raw driver data:', data.data);
            const mappedDrivers = data.data.map((driver: any) => ({
              id: driver.id,
              name: driver.name || 'Unknown Driver',
              phone: driver.phone || '',
              email: '',
              role: 'driver',
              isAvailable: driver.status === 'available',
              currentLocation: driver.location,
              vehicle: {
                make: driver.service_provider || 'Unknown',
                model: driver.vehicle_type || 'Unknown',
                year: 0,
                plateNumber: driver.license_number || '',
                type: driver.vehicle_type || 'bike',
              },
              rating: 5,
              earnings: 0,
              completedRides: 0,
              avatar_url: '',
            }));
            // console.log(
            //   '[RideConfirmation] Setting nearbyDrivers:',
            //   mappedDrivers
            // );
            setNearbyDrivers(mappedDrivers);
            break;
          case 'ride_accepted':
            // console.log(
            //   '[RideConfirmation] Processing ride_accepted notification'
            // );
            setCurrentRide(data.data);
            router.push('/Ride/active-ride');
            break;
          case 'driver_rejected':
            // console.log(
            //   '[RideConfirmation] Processing driver_rejected notification'
            // );
            Alert.alert('Driver Unavailable', 'Please select another driver');
            break;
          default:
          // console.log(
          //   '[RideConfirmation] Unknown notification type:',
          //   data.notificationType
          // );
        }
      } else {
        // console.log(
        //   '[RideConfirmation] Message not for this rider or wrong type'
        // );
      }
    };

    // console.log('[RideConfirmation] Adding WebSocket message handler');
    rideService.addMessageHandler(handleMessage);

    return () => {
      console.log('[RideConfirmation] Removing WebSocket message handler');
      rideService.removeMessageHandler(handleMessage);
    };
  }, [currentRide]);

  // Handler for driver acceptance/rejection after booking
  useWaitForDriverAcceptance(
    waitingForDriver ? currentRide?.id : undefined,
    (ride) => {
      setCurrentRide(ride);
      setWaitingForDriver(false);
      router.push('/Ride/active-ride');
    },
    () => {
      setWaitingForDriver(false);
      Alert.alert('Driver Unavailable', 'Please select another driver');
    }
  );

  const handleDriverSelect = async (driver: Driver) => {
    try {
      console.log('[RideConfirmation] Driver selected:', driver);

      // Show confirmation dialog
      Alert.alert(
        'Confirm Driver',
        `Book ride with ${driver.name}?\nVehicle: ${driver.vehicle.make} ${driver.vehicle.model}\nPlate: ${driver.vehicle.plateNumber}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Book Now',
            onPress: async () => {
              await confirmBookingWithDriver(driver);
            },
          },
        ]
      );
    } catch (error) {
      console.error('[RideConfirmation] Error selecting driver:', error);
      Alert.alert('Error', 'Failed to select driver');
    }
  };

  const confirmBookingWithDriver = async (driver: Driver) => {
    try {
      console.log(
        '[RideConfirmation] Confirming booking with driver:',
        driver.id
      );

      // Update the booking with the selected driver
      const response = await fetch(
        `${API_URL}/bookings/${currentRide?.id}/assign-driver`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getAuthToken()}`,
          },
          body: JSON.stringify({
            driver_id: driver.id,
          }),
        }
      );

      if (response.ok) {
        const bookingData = await response.json();
        console.log(
          '[RideConfirmation] Driver assigned successfully:',
          bookingData
        );

        // Update the current ride with driver info
        setCurrentRide((prev) =>
          prev
            ? {
                ...prev,
                driverId: driver.id,
                status: 'driver_assigned',
              }
            : null
        );
        setWaitingForDriver(true); // Start waiting for driver response
        // router.push('/Ride/active-ride'); // Now handled by hook
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to assign driver');
      }
    } catch (error) {
      console.error('[RideConfirmation] Error confirming booking:', error);
      Alert.alert('Error', 'Failed to confirm booking');
    }
  };

  // Function to fetch nearby drivers via REST API
  const fetchNearbyDrivers = async () => {
    if (!currentRide) return;

    try {
      console.log('[RideConfirmation] Fetching nearby drivers via REST API');
      const response = await fetch(`${API_URL}/demand/nearby-drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: currentRide.pickup.latitude,
          longitude: currentRide.pickup.longitude,
          radius: 5, // 5km radius
        }),
      });

      if (response.ok) {
        const drivers = await response.json();
        console.log('[RideConfirmation] REST API drivers received:', drivers);

        const mappedDrivers = drivers.map((driver: any) => ({
          id: driver.id,
          name: driver.name || 'Unknown Driver',
          phone: driver.phone || '',
          email: '',
          role: 'driver',
          isAvailable: driver.status === 'available',
          currentLocation: driver.location,
          vehicle: {
            make: driver.service_provider || 'Unknown',
            model: driver.vehicle_type || 'Unknown',
            year: 0,
            plateNumber: driver.license_number || '',
            type: driver.vehicle_type || 'bike',
          },
          rating: 5,
          earnings: 0,
          completedRides: 0,
          avatar_url: '',
        }));

        setNearbyDrivers(mappedDrivers);
      } else {
        console.error(
          '[RideConfirmation] Failed to fetch nearby drivers:',
          response.status
        );
      }
    } catch (error) {
      console.error('[RideConfirmation] Error fetching nearby drivers:', error);
    }
  };

  // Start polling for nearby drivers
  useEffect(() => {
    if (currentRide) {
      // Initial fetch
      fetchNearbyDrivers();

      // Set up polling every 10 seconds
      const interval = setInterval(fetchNearbyDrivers, 10000);
      setPollingInterval(interval);

      console.log('[RideConfirmation] Started polling for nearby drivers');

      return () => {
        if (interval) {
          clearInterval(interval);
          console.log('[RideConfirmation] Stopped polling for nearby drivers');
        }
      };
    }
  }, [currentRide]);

  if (!currentRide) return null;

  console.log('Rendering RideStatusCard with nearbyDrivers:', nearbyDrivers);

  const driverMarkers: MarkerData[] = nearbyDrivers.map((driver) => ({
    id: driver.id,
    coordinate: driver.currentLocation || currentRide.pickup,
    title: driver.name,
    description: `${driver.vehicle.make} ${driver.vehicle.model} - ${driver.vehicle.plateNumber}`,
    onPress: () => handleDriverSelect(driver),
  }));

  if (waitingForDriver) {
    return (
      <View style={styles.container}>
        <MapComponent
          routeCoordinates={routeCoordinates}
          currentLocation={currentRide.pickup}
          markers={driverMarkers}
        />
        <RideStatusCard
          ride={currentRide}
          nearbyDrivers={nearbyDrivers}
          onDriverSelect={handleDriverSelect}
          onRefreshDrivers={fetchNearbyDrivers}
        />
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              elevation: 4,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
            >
              Waiting for driver to accept...
            </Text>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapComponent
        routeCoordinates={routeCoordinates}
        currentLocation={currentRide.pickup}
        markers={driverMarkers}
      />
      <RideStatusCard
        ride={currentRide}
        nearbyDrivers={nearbyDrivers}
        onDriverSelect={handleDriverSelect}
        onRefreshDrivers={fetchNearbyDrivers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
