import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';

interface SplashScreenProps {
  onPassengerPress: () => void;
  onDriverPress: () => void;
}

export default function SplashScreen({
  onPassengerPress,
  onDriverPress,
}: SplashScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🚗</Text>
        </View>
        <Text style={styles.appName}>Smart Motos</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Passenger"
          onPress={onPassengerPress}
          variant="primary"
          size="large"
          style={styles.button}
        />
        <Button
          title="Driver"
          onPress={onDriverPress}
          variant="outline"
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.default,
    justifyContent: 'space-between',
    padding: Layout.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.l,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.neutral.white,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    marginVertical: Layout.spacing.s,
  },
});