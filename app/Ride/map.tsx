import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';

const DRIVER = {
  id: '1',
  name: 'John Doe',
  rating: 4.8,
  plate: 'RAB 123 A',
  avatar: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export default function MapScreen() {
  const [isDriverAccepted, setIsDriverAccepted] = useState(false);

  const handleBookNow = () => {
    // Simulate driver accepting the ride
    setTimeout(() => {
      setIsDriverAccepted(true);
    }, 2000);
  };

  const handleConfirmRide = () => {
    router.push('/Ride/payment');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/4318822/pexels-photo-4318822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
        style={styles.map}
      />

      <View style={styles.bottomSheet}>
        <View style={styles.driverCard}>
          <Image source={{ uri: DRIVER.avatar }} style={styles.driverAvatar} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{DRIVER.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.primary.default} fill={Colors.primary.default} />
              <Text style={styles.rating}>{DRIVER.rating}</Text>
            </View>
            <Text style={styles.plateNumber}>{DRIVER.plate}</Text>
          </View>
        </View>

        <View style={styles.tripInfo}>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailLabel}>Distance</Text>
            <Text style={styles.tripDetailValue}>5.2 km</Text>
          </View>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailLabel}>Time</Text>
            <Text style={styles.tripDetailValue}>15 mins</Text>
          </View>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailLabel}>Price</Text>
            <Text style={styles.tripDetailValue}>1000 Rwf</Text>
          </View>
        </View>

        <Button
          title={isDriverAccepted ? "Confirm Ride" : "Book Now"}
          onPress={isDriverAccepted ? handleConfirmRide : handleBookNow}
          loading={!isDriverAccepted}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  bottomSheet: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.l,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Layout.spacing.l,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  rating: {
    marginLeft: Layout.spacing.xs,
    color: Colors.secondary.default,
    fontSize: 14,
  },
  plateNumber: {
    color: Colors.neutral.dark,
    fontSize: 14,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.neutral.lighter,
  },
  tripDetail: {
    alignItems: 'center',
  },
  tripDetailLabel: {
    fontSize: 12,
    color: Colors.neutral.dark,
    marginBottom: Layout.spacing.xs,
  },
  tripDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary.default,
  },
  button: {
    marginTop: Layout.spacing.l,
  },
});