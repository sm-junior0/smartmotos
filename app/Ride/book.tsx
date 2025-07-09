import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { useRide } from '@/hooks/useRideContext';
import Checkbox from 'expo-checkbox';
import { ChevronLeft, Search } from 'lucide-react-native';

// Dummy payment methods for demonstration
const PAYMENT_METHODS = [
  { label: 'Wallet', value: 'wallet' },
  { label: 'Credit Card', value: 'card' },
  { label: 'JDM PLBS', value: 'jdm_plbs' },
];

export default function BookRideScreen() {
  const { rideState, updateBookingDetails, setRideStatus } = useRide();

  const handleAddStop = () => {
    updateBookingDetails({ stops: [...rideState.bookingDetails.stops, ''] });
  };

  const handleRemoveStop = (index: number) => {
    updateBookingDetails({
      stops: rideState.bookingDetails.stops.filter((_, i) => i !== index),
    });
  };

  const handleUpdateStop = (index: number, value: string) => {
    updateBookingDetails({
      stops: rideState.bookingDetails.stops.map((stop, i) => (i === index ? value : stop)),
    });
  };

  const handleDone = () => {
    // Assuming "Done" on this screen leads to the map view to confirm pickup/dropoff
    setRideStatus('booking_map');
    router.push('/Ride/map');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.neutral.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BOOK SEAT</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={Colors.neutral.white} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Input
            label="Pickup Location"
            placeholder="Enter pickup location"
            value={rideState.bookingDetails.pickup}
            onChangeText={(text) => updateBookingDetails({ pickup: text })}
            style={styles.input}
            labelStyle={styles.inputLabel}
            placeholderTextColor={Colors.neutral.dark}
          />

          <Input
            label="Drop-off Location"
            placeholder="Enter drop-off location"
            value={rideState.bookingDetails.dropoff}
            onChangeText={(text) => updateBookingDetails({ dropoff: text })}
            style={styles.input}
            labelStyle={styles.inputLabel}
            placeholderTextColor={Colors.neutral.dark}
          />

          {rideState.bookingDetails.stops.map((stop, index) => (
            <View key={index} style={styles.stopContainer}>
              <Input
                label={`Stop ${index + 1}`}
                placeholder="Enter stop location"
                value={stop}
                onChangeText={(text) => handleUpdateStop(index, text)}
                containerStyle={styles.stopInput}
                style={styles.input}
                labelStyle={styles.inputLabel}
                placeholderTextColor={Colors.neutral.dark}
              />
              {index > 0 && (
                <Button
                  title="Remove"
                  onPress={() => handleRemoveStop(index)}
                  variant="outline"
                  size="small"
                  style={styles.removeButton}
                />
              )}
            </View>
          ))}

          <Button
            title="Add Stop"
            onPress={handleAddStop}
            variant="outline"
            style={styles.addButton}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mode of payment</Text>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.value}
                style={styles.paymentMethodItem}
                onPress={() => updateBookingDetails({ paymentMethod: method.value })}
              >
                <Text
                  style={[
                    styles.paymentMethodText,
                    rideState.bookingDetails.paymentMethod === method.value && styles.selectedPaymentMethodText,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* <View style={styles.checkboxContainer}>
            <Checkbox
              value={rideState.bookingDetails.bookForFriend}
              onValueChange={(value) => updateBookingDetails({ bookForFriend: value })}
              color={rideState.bookingDetails.bookForFriend ? Colors.primary.default : Colors.neutral.white}
            />
            <Text style={styles.checkboxLabel}>Book for a friend</Text>
          </View> */}
        </View>
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
         <Button
           title="Done"
           onPress={handleDone}
           style={styles.doneButton}
         />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.dark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    backgroundColor: Colors.neutral.dark,
  },
  backButton: {
    padding: Layout.spacing.s,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral.white,
  },
  searchButton: {
    padding: Layout.spacing.s,
  },
  content: {
    padding: Layout.spacing.xl,
  },
  input: {
    backgroundColor: Colors.neutral.white,
    color: Colors.neutral.dark,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Layout.spacing.s,
    color: Colors.neutral.white,
  },
  stopContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  stopInput: {
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  removeButton: {
    marginBottom: Layout.spacing.m,
    height: 50, // Adjust height to align with input
    justifyContent: 'center',
  },
  addButton: {
    marginTop: Layout.spacing.s,
    marginBottom: Layout.spacing.l,
  },
  sectionContainer: {
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Layout.spacing.m,
    color: Colors.neutral.white,
  },
  paymentMethodItem: {
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.dark,
  },
  paymentMethodText: {
    fontSize: 16,
    color: Colors.neutral.light,
  },
  selectedPaymentMethodText: {
    fontWeight: 'bold',
    color: Colors.primary.default,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  checkboxLabel: {
    marginLeft: Layout.spacing.s,
    fontSize: 16,
    color: Colors.neutral.white,
  },
   bottomButtonContainer: {
    padding: Layout.spacing.xl,
    backgroundColor: Colors.neutral.dark,
  },
  doneButton: {
    width: '100%',
  },
});