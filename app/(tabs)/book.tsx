import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';

const POPULAR_DESTINATIONS = [
  'African Leadership University',
  'Rwanda Art Museum',
  'Kimironko Market',
  'Kigali Convention Centre',
];

export default function BookScreen() {
  const router = useRouter();

  const handleBookRide = () => {
    router.push('/Ride/book');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Ride</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Ride</Text>
          <Text style={styles.cardDescription}>
            Book a ride to your destination quickly and easily
          </Text>
          <Button
            title="Book Now"
            onPress={() => router.push('/Ride/map')}
            variant="primary"
            size="large"
            style={styles.button}
          />
        </View>

        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        {POPULAR_DESTINATIONS.map((destination, index) => (
          <TouchableOpacity
            key={index}
            style={styles.destinationItem}
            onPress={handleBookRide}
          >
            <MapPin size={20} color={Colors.neutral.dark} />
            <Text style={styles.destinationText}>{destination}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  header: {
    backgroundColor: Colors.primary.default,
    padding: Layout.spacing.xl,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary.default,
  },
  content: {
    padding: Layout.spacing.xl,
  },
  card: {
    backgroundColor: Colors.secondary.default,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.white,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.neutral.light,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginBottom: Layout.spacing.l,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
  },
  destinationText: {
    marginLeft: Layout.spacing.m,
    fontSize: 16,
    color: Colors.secondary.default,
  },
});