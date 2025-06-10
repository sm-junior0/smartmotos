import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Menu, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import RideStatusCard from '@/components/common/RideStatusCard';
import { DrawerNavigationProp, useDrawerStatus } from '@react-navigation/drawer';

const dummyTrips = [
  {
    id: '1',  
    time: '7:15 AM',
    pickup: 'Nyabugogo',
    dropoff: 'Masaka',
    fare: 'RWF1500',
    paymentMethod: 'Momo',
    rating: 5,
  },
  {
    id: '2',
    time: '7:15 AM',
    pickup: 'Nyabugogo',
    dropoff: 'Masaka',
    fare: 'RWF1500',
    paymentMethod: 'Momo',
    rating: 5,
  },
  {
    id: '3',
    time: '7:15 AM',
    pickup: 'Nyabugogo',
    dropoff: 'Masaka',
    fare: 'RWF1500',
    paymentMethod: 'Momo',
    rating: 5,
  },
];

const stats = {
  trips: 22,
  hoursOnline: 11,
  earned: 'RWF5000',
};

const timeFilters = ['Today', 'Week', 'Month', 'All time'];

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const isDrawOpen = useDrawerStatus() === 'open'; 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FloatingActionButton
          icon={<Menu color={colors.text.primary} size={24} />}
          position="top-left"
          backgroundColor={colors.background.paper}
          onPress={() => navigation.openDrawer()}
        />
        <FloatingActionButton
          icon={<Bell color={colors.text.primary} size={24} />}
          position="top-right"
          backgroundColor={colors.background.paper}
          onPress={() => {}}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.timeFilters}>
          {timeFilters.map((filter) => (
            <View
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.trips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.hoursOnline}hrs</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.earned}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Trips today</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {dummyTrips.map((trip) => (
            <RideStatusCard
              key={trip.id}
              time={trip.time}
              pickup={trip.pickup}
              dropoff={trip.dropoff}
              fare={trip.fare}
              paymentMethod={trip.paymentMethod}
              rating={trip.rating}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    paddingTop: spacing.md
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  statsContainer: {
    padding: spacing.md,
  },
  timeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingTop: spacing['2xl']
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.paper,
  },
  filterButtonActive: {
    backgroundColor: colors.background.default,
  },
  filterText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  filterTextActive: {
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
});