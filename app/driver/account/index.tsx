import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  DrawerNavigationProp,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { Menu } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { useRouter } from 'expo-router';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
};

export default function App() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();

  const isDrawOpen = useDrawerStatus() === 'open';

  const handleSignout = () => {
    console.log('Sign out clicked');
    router.replace('/driver/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        {/* Menu button */}
        <View style={styles.menuButton}>
          <FloatingActionButton
            icon={<Menu color={colors.text.primary} size={24} />}
            position="top-left"
            backgroundColor={colors.background.paper}
            onPress={() => navigation.openDrawer()}
          />
        </View>

        {/* Wallet balance */}
        <View style={styles.walletContainer}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.momoTag}>
              <Text style={styles.momoText}>Momo</Text>
            </View>
            <Text style={styles.balanceText}>24,000 Rwf</Text>
          </View>
        </View>

        {/* Dedicated badge */}
        <View style={styles.dedicatedContainer}>
          <Text style={styles.dedicatedText}>Dedicated</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={18} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>Manene Junior</Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3].map((i) => (
              <FontAwesome
                key={`star-filled-${i}`}
                name="star"
                size={20}
                color="#FFD700"
              />
            ))}
            {[1, 2].map((i) => (
              <FontAwesome
                key={`star-empty-${i}`}
                name="star-o"
                size={20}
                color="#FFD700"
              />
            ))}
          </View>

          <Text style={styles.phoneNumber}>+250 798 384 666</Text>
        </View>

        {/* Menu options */}
        <View style={styles.menuOptions}>
          <MenuItem
            icon={<FontAwesome name="user" size={24} color="#FFD700" />}
            title="Profile settings"
            onPress={() => router.push('/driver/account/profile-settings')}
          />
          <MenuItem
            icon={<FontAwesome name="lock" size={24} color="#FFD700" />}
            title="Password"
            onPress={() => router.push('/driver/account/password')}
          />
          <MenuItem
            icon={<FontAwesome5 name="car" size={24} color="#FFD700" />}
            title="Vehicle details"
            onPress={() => router.push('/driver/account/vehicle-details')}
          />
          <MenuItem
            icon={<FontAwesome5 name="headset" size={24} color="#FFD700" />}
            title="Customer support"
            onPress={() => router.push('/driver/account/customer-support')}
          />
        </View>

        {/* Sign out button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignout}>
          <MaterialIcons name="logout" size={24} color="#FFD700" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          {icon}
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#FFD700" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    backgroundColor: '#FFD700',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
  },
  menuButton: {
    position: 'absolute',
    top: spacing.md,
    left: -15,
    zIndex: 10,
  },
  walletContainer: {
    position: 'relative',
    right: -19,
    backgroundColor: '#000',
    alignSelf: 'center',
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
    paddingVertical: spacing.lg,
    minWidth: 200,
  },
  walletLabel: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  momoTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 10,
  },
  momoText: {
    color: 'black',
    fontFamily: typography.fontFamily.bold,
  },
  balanceText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dedicatedContainer: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  dedicatedText: {
    color: 'white',
    fontFamily: typography.fontFamily.medium,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  profileImageContainer: {
    position: 'relative',
    marginTop: -70,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: typography.fontSize.lg,
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
  },
  phoneNumber: {
    color: 'white',
    fontSize: 16,
    marginTop: spacing.sm,
  },
  menuOptions: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    color: 'white',
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: '#2a2a2a',
    borderRadius: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  signOutText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginLeft: spacing.sm,
  },
});