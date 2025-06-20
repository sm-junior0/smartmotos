import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MockGoogleServices } from '../../services/mockGoogleServices';
import { rideService } from '../../services/ride';
import { Location } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notification';

interface LocationSuggestion {
  id: string;
  name: string;
}

export const RideBooking: React.FC = () => {
  const { user } = useAuth();
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [selectedPickup, setSelectedPickup] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<Location | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const searchLocations = async (query: string, isPickup: boolean) => {
      if (query.length < 2) {
        isPickup ? setPickupSuggestions([]) : setDestinationSuggestions([]);
        return;
      }

      try {
        const suggestions = await MockGoogleServices.searchPlaces(query);
        isPickup
          ? setPickupSuggestions(suggestions)
          : setDestinationSuggestions(suggestions);
      } catch (error) {
        console.error('Error searching locations:', error);
      }
    };

    if (pickupQuery) {
      timeoutId = setTimeout(() => searchLocations(pickupQuery, true), 300);
    }
    if (destinationQuery) {
      timeoutId = setTimeout(
        () => searchLocations(destinationQuery, false),
        300
      );
    }

    return () => clearTimeout(timeoutId);
  }, [pickupQuery, destinationQuery]);

  const handleLocationSelect = async (
    suggestion: LocationSuggestion,
    isPickup: boolean
  ) => {
    try {
      const coordinates = await MockGoogleServices.getCoordinates(
        suggestion.id
      );
      if (coordinates) {
        if (isPickup) {
          setSelectedPickup(coordinates);
          setPickupQuery(suggestion.name);
          setPickupSuggestions([]);
        } else {
          setSelectedDestination(coordinates);
          setDestinationQuery(suggestion.name);
          setDestinationSuggestions([]);
        }

        // Calculate fare if both locations are selected
        if (
          (isPickup && selectedDestination) ||
          (!isPickup && selectedPickup)
        ) {
          const pickup = isPickup ? coordinates : selectedPickup!;
          const destination = isPickup ? selectedDestination! : coordinates;
          const fare = await rideService.calculateFare(pickup, destination);
          setEstimatedFare(fare);
        }
      }
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };

  const handleBookRide = async () => {
    if (!selectedPickup || !selectedDestination || !user) return;

    setLoading(true);
    setBookingStatus('Requesting ride...');

    try {
      const ride = await rideService.requestRide(
        user.id,
        selectedPickup,
        selectedDestination
      );

      setBookingStatus('Looking for drivers...');

      // Listen for ride updates
      const ws = new WebSocket('ws://localhost:8080');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'ride_update' && data.ride.id === ride.id) {
          switch (data.ride.status) {
            case 'accepted':
              setBookingStatus('Driver found! They are on their way.');
              break;
            case 'started':
              setBookingStatus('Your ride has started!');
              break;
            case 'completed':
              setBookingStatus('Ride completed!');
              ws.close();
              break;
            case 'cancelled':
              setBookingStatus('Ride cancelled.');
              ws.close();
              break;
          }
        }
      };
    } catch (error) {
      console.error('Error booking ride:', error);
      setBookingStatus('Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={pickupQuery}
          onChangeText={setPickupQuery}
        />
        {pickupSuggestions.length > 0 && (
          <ScrollView style={styles.suggestions}>
            {pickupSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionItem}
                onPress={() => handleLocationSelect(suggestion, true)}
              >
                <Text>{suggestion.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destinationQuery}
          onChangeText={setDestinationQuery}
        />
        {destinationSuggestions.length > 0 && (
          <ScrollView style={styles.suggestions}>
            {destinationSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionItem}
                onPress={() => handleLocationSelect(suggestion, false)}
              >
                <Text>{suggestion.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {estimatedFare !== null && (
        <View style={styles.fareContainer}>
          <Text style={styles.fareText}>
            Estimated Fare: ${estimatedFare.toFixed(2)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.bookButton,
          (!selectedPickup || !selectedDestination) && styles.disabledButton,
        ]}
        onPress={handleBookRide}
        disabled={!selectedPickup || !selectedDestination || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.bookButtonText}>Book Ride</Text>
        )}
      </TouchableOpacity>

      {bookingStatus && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{bookingStatus}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  suggestions: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fareContainer: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 20,
  },
  fareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  bookButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
});
