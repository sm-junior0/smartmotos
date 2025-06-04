import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { CreditCard, Wallet, Check, ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';
import { useRide } from '@/hooks/useRideContext';

const PAYMENT_METHODS = [
  {
    id: 'wallet',
    name: 'Wallet',
    icon: Wallet,
    balance: '24,000 Rwf',
  },
  {
    id: 'card',
    name: 'Credit Card',
    icon: CreditCard,
    last4: '4242',
  },
];

export default function PaymentScreen() {
  const { rideState, setRideStatus } = useRide();
  const { currentTrip } = rideState;

  const [selectedMethod, setSelectedMethod] = useState('wallet');

  const handlePayNow = () => {
    setRideStatus('completed');
    router.replace('/Ride/rating');
  };

  const tripFare = (parseInt(currentTrip?.baseFare?.replace(' Rwf', '') || '0') + parseInt(currentTrip?.distanceFare?.replace(' Rwf', '') || '0')).toString() + ' Rwf';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.neutral.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INVOICE</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {currentTrip ? (
          <View style={styles.invoiceCard}>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Pickup point</Text>
              <Text style={styles.invoiceValue}>{rideState.bookingDetails.pickup}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Drop point</Text>
              <Text style={styles.invoiceValue}>{rideState.bookingDetails.dropoff}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Trip fare</Text>
              <Text style={styles.invoiceValue}>{tripFare}</Text>
            </View>
            {currentTrip.waitingFee && parseInt(currentTrip.waitingFee.replace(' Rwf', '')) > 0 && (
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Waiting fee</Text>
                <Text style={styles.invoiceValue}>{currentTrip.waitingFee}</Text>
              </View>
            )}

            <View style={[styles.invoiceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{currentTrip.total}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading invoice...</Text>
          </View>
        )}
      </ScrollView>

      {currentTrip && (
        <View style={styles.footer}>
          <Button
            title="Pay now"
            onPress={handlePayNow}
            style={styles.payNowButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.black,
  },
  topBar: {
    paddingTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral.black,
  },
  backButton: {
    padding: Layout.spacing.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral.white,
  },
  scrollView: {
    flex: 1,
  },
  invoiceCard: {
    backgroundColor: Colors.neutral.black,
    padding: Layout.spacing.xl,
    margin: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.neutral.darker,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.s,
  },
  invoiceLabel: {
    fontSize: 16,
    color: Colors.neutral.white,
  },
  invoiceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.darker,
    marginVertical: Layout.spacing.m,
  },
  totalRow: {
    marginTop: Layout.spacing.m,
    paddingTop: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.darker,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.default,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.neutral.white,
  },
  footer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.m,
    paddingBottom: Layout.spacing.xl,
    backgroundColor: Colors.neutral.black,
  },
  payNowButton: {
  },
});