import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

export default function BookRideScreen() {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    stops: [''],
    paymentMethod: 'wallet',
  });

  const handleAddStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, ''],
    }));
  };

  const handleRemoveStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateStop = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => (i === index ? value : stop)),
    }));
  };

  const handleContinue = () => {
    router.push('/Ride/map');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Input
          label="Pickup Location"
          placeholder="Enter pickup location"
          value={formData.pickup}
          onChangeText={(text) => setFormData({ ...formData, pickup: text })}
        />

        <Input
          label="Drop-off Location"
          placeholder="Enter drop-off location"
          value={formData.dropoff}
          onChangeText={(text) => setFormData({ ...formData, dropoff: text })}
        />

        {formData.stops.map((stop, index) => (
          <View key={index} style={styles.stopContainer}>
            <Input
              label={`Stop ${index + 1}`}
              placeholder="Enter stop location"
              value={stop}
              onChangeText={(text) => handleUpdateStop(index, text)}
              containerStyle={styles.stopInput}
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

        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  content: {
    padding: Layout.spacing.xl,
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
  },
  addButton: {
    marginTop: Layout.spacing.s,
    marginBottom: Layout.spacing.l,
  },
  continueButton: {
    marginTop: Layout.spacing.l,
  },
});