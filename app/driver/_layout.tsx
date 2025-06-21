import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import DriverNotification from '@/components/driver/DriverNotification';
import { View } from 'react-native';
import { AuthProvider } from '@/hooks/AuthContext';
import DrawerContent from '@/components/navigation/DrawerContent';

function DriverLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
          <Drawer.Screen name="home" options={{ headerShown: false }} />
          <Drawer.Screen name="rides" options={{ headerShown: false }} />
          <Drawer.Screen name="account" options={{ headerShown: false }} />
          <Drawer.Screen name="auth" options={{ headerShown: false }} />
        </Drawer>
        <DriverNotification />
      </View>
    </AuthProvider>
  );
}

export default DriverLayout;
