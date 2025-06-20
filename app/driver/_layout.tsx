import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import DriverNotification from '@/components/driver/DriverNotification';
import { View } from 'react-native';
import { AuthProvider } from '@/hooks/AuthContext';

function DriverLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="ride" options={{ headerShown: false }} />
        <Stack.Screen name="earnings" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <DriverNotification />
    </View>
  );
}

// Wrap the exported component with AuthProvider at the highest level
export default function WrappedDriverLayout() {
  return (
    <AuthProvider>
      <DriverLayout />
    </AuthProvider>
  );
}