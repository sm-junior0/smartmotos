import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';

export default function FareEstimateScreen() {
  const params = useLocalSearchParams();
  const { pickup, dropoff, rideType = 'bike' } = params;

  // Mock fare calculation
  const fare = rideType === 'car' ? 1200 : rideType === 'van' ? 2000 : 800;
  const eta = rideType === 'car' ? '7 min' : rideType === 'van' ? '10 min' : '5 min';

  const handleConfirm = () => {
    router.push({
      pathname: '/Ride/map',
      params: { ...params, fare, eta },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fare Estimate</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Pickup:</Text>
        <Text style={styles.value}>{pickup}</Text>
        <Text style={styles.label}>Drop-off:</Text>
        <Text style={styles.value}>{dropoff}</Text>
        <Text style={styles.label}>Ride Type:</Text>
        <Text style={styles.value}>{rideType}</Text>
        <Text style={styles.label}>Estimated Fare:</Text>
        <Text style={styles.value}>{fare} Rwf</Text>
        <Text style={styles.label}>ETA:</Text>
        <Text style={styles.value}>{eta}</Text>
      </View>
      <Button title="Confirm & Book" onPress={handleConfirm} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: Layout.spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.l,
  },
  card: {
    backgroundColor: Colors.secondary.default,
    borderRadius: 12,
    padding: 20,
    marginBottom: Layout.spacing.xl,
  },
  label: {
    fontSize: 14,
    color: Colors.neutral.light,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: Colors.primary.default,
    fontWeight: '600',
  },
  button: {
    marginTop: Layout.spacing.xl,
  },
}); 