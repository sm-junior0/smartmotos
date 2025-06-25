import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Menu, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import { RideStatusCard } from '../../components/common/RideStatusCard';
import {
  DrawerNavigationProp,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import MapComponent from '../../components/common/MapComponent';
import Button from '../../components/common/Button';
import { Ride, RideStatus, Location } from '../../types';
import { rideService } from '../../services/ride';

const dummyTrips = [
  {
    id: '1',
    time: '7:15 AM',
    pickup: 'Nyabugogo',
    dropoff: 'Masaka',
    fare: 'RWF1500',
    paymentMethod: 'Momo',
    rating: 5,
  },
  {
    id: '2',
    time: '7:15 AM',
    pickup: 'Nyabugogo',
    dropoff: 'Masaka',
    fare: 'RWF1500',
    paymentMethod: 'Momo',
    rating: 5,
  },
  {
    id: '3',
    time: '7:15 AM',
    pickup: 'Nyabugogo',
    dropoff: 'Masaka',
    fare: 'RWF1500',
    paymentMethod: 'Momo',
    rating: 5,
  },
];

const stats = {
  trips: 22,
  hoursOnline: 11,
  earned: 'RWF5000',
};

const timeFilters = ['Today', 'Week', 'Month', 'All time'];

export default function DriverHome() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [isActive, setIsActive] = useState(false);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [driverId] = useState('driver-123'); // In real app, get from auth context

  const isDrawOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    const handleMessage = (data: any) => {
      if (data.type === 'driver_notification' && data.driverId === driverId) {
        switch (data.data.type) {
          case 'ride_request':
            handleRideRequest(data.data.ride);
            break;
          case 'ride_update':
            setCurrentRide(data.data.ride);
            break;
          case 'payment_completed':
            handlePaymentCompleted(data.data.ride);
            break;
        }
      }
    };

    rideService.addMessageHandler(handleMessage);

    return () => {
      rideService.removeMessageHandler(handleMessage);
    };
  }, [driverId]);

  const handleToggleActive = async (value: boolean) => {
    try {
      await rideService.updateDriverStatus(driverId, value);
      setIsActive(value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleRideRequest = (ride: Ride) => {
    Alert.alert(
      'New Ride Request',
      `From: ${formatLocation(ride.pickup)}\nTo: ${formatLocation(
        ride.destination
      )}\nFare: $${ride.fare}`,
      [
        {
          text: 'Reject',
          style: 'cancel',
          onPress: () => handleDriverResponse(ride.id, false),
        },
        {
          text: 'Accept',
          onPress: () => handleDriverResponse(ride.id, true),
        },
      ]
    );
  };

  const formatLocation = (location: Location) => {
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  };

  const handleDriverResponse = async (rideId: string, accepted: boolean) => {
    try {
      await rideService.handleDriverResponse(rideId, driverId, accepted);
      if (accepted) {
        const ride = await rideService.getRideDetails(rideId);
        if (ride) setCurrentRide(ride);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to respond to ride request');
    }
  };

  const handleStatusUpdate = async (status: RideStatus) => {
    try {
      await rideService.updateRideStatus(currentRide!.id, status);
    } catch (error) {
      Alert.alert('Error', 'Failed to update ride status');
    }
  };

  const handlePaymentCompleted = (ride: Ride) => {
    Alert.alert('Payment Received', 'The passenger has completed the payment');
    setCurrentRide(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FloatingActionButton
          icon={<Menu color={colors.text.primary} size={24} />}
          position="top-left"
          backgroundColor={colors.background.paper}
          onPress={() => navigation.openDrawer()}
        />
        <FloatingActionButton
          icon={<Bell color={colors.text.primary} size={24} />}
          position="top-right"
          backgroundColor={colors.background.paper}
          onPress={() => {}}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.timeFilters}>
          {timeFilters.map((filter) => (
            <View
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.trips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.hoursOnline}hrs</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.earned}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Switch value={isActive} onValueChange={handleToggleActive} />
          {isActive ? (
            <Button
              text="Go Offline"
              onPress={() => handleToggleActive(false)}
              style={styles.offlineButton}
              variant="primary"
            />
          ) : (
            <Button
              text="Go Online"
              onPress={() => handleToggleActive(true)}
              style={styles.onlineButton}
              variant="primary"
            />
          )}
        </View>
        {currentRide && (
          <RideStatusCard
            ride={currentRide}
            isDriver={true}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    paddingTop: spacing.md,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  statsContainer: {
    padding: spacing.md,
  },
  timeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingTop: spacing['2xl'],
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.paper,
  },
  filterButtonActive: {
    backgroundColor: colors.background.default,
  },
  filterText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  filterTextActive: {
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  onlineButton: {
    backgroundColor: '#34C759',
  },
  offlineButton: {
    backgroundColor: '#FF3B30',
  },
});
