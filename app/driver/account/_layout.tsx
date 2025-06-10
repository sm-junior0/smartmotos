import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/styles/theme';
import { Text } from 'react-native';

export default function DriverAccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background.default },
        headerTintColor: colors.text.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile-settings"
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Profile settings</Text>,
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Password</Text>,
        }}
      />
      <Stack.Screen
        name="password/change"
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Change password</Text>,
        }}
      />
      <Stack.Screen
        name="password/forgot"
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Forgot password</Text>,
        }}
      />
      <Stack.Screen
        name="password/forgot/verify"
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Forgot password</Text>,
        }}
      />
      <Stack.Screen
        name="password/forgot/create-new-password"
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Create new password</Text>,
        }}
      />
      <Stack.Screen 
        name="vehicle-details" 
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Vehicle details</Text>,
        }}
      />
      <Stack.Screen 
        name="customer-support" 
        options={{
          headerTitle: () => <Text style={{ color: colors.text.primary }}>Customer support</Text>,
        }}
      />
    </Stack>
  );
}