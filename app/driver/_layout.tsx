// import React from 'react';
// import { Stack } from 'expo-router';

// export default function DriverLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="auth" />
//       <Stack.Screen name="home" />
//     </Stack>
//   );
// }


import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerContent from '@/components/navigation/DrawerContent';

export default function DriverLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          swipeEnabled: true,
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            drawerLabel: 'Home',
          }}
        />
        <Drawer.Screen
          name="rides"
          options={{
            title: 'Rides',
            drawerLabel: 'Rides',
          }}
        />
        <Drawer.Screen
          name="account"
          options={{
            title: 'Account',
            drawerLabel: 'Account',
          }}
        />
        <Drawer.Screen
          name="auth"
          options={{
            title: 'Auth',
            drawerLabel: 'Auth',
            swipeEnabled: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}