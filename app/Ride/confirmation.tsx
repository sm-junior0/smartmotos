import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';

export default function ConfirmationScreen() {
  const handleDone = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle2 size={80} color={Colors.success.default} />
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.message}>
          Your ride has been booked successfully. The driver is on the way.
        </Text>

        <View style={styles.driverCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=100' }}
            style={styles.driverAvatar}
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>John Doe</Text>
            <Text style={styles.plateNumber}>RAB 123 A</Text>
          </View>
        </View>

        <Button
          title="Done"
          onPress={handleDone}
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
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary.default,
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
  },
  message: {
    fontSize: 16,
    color: Colors.neutral.dark,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.lightest,
    padding: Layout.spacing.l,
    borderRadius: Layout.borderRadius.l,
    width: '100%',
    marginBottom: Layout.spacing.xl,
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
  plateNumber: {
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  button: {
    width: '100%',
  },
});