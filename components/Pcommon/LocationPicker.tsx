import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Input from '@/components/UI/Input';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { MapPin } from 'lucide-react-native';
import { mockGoogleServices, Place } from '@/services/mockGoogleServices';

interface LocationPickerProps {
  label: string;
  placeholder: string;
  value: string;
  onLocationSelect: (location: string, coordinates: { lat: number; lng: number }) => void;
  style?: any;
  labelStyle?: any;
}

export function LocationPicker({
  label,
  placeholder,
  value,
  onLocationSelect,
  style,
  labelStyle,
}: LocationPickerProps) {
  const [searchText, setSearchText] = useState(value);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);
      setShowSuggestions(true);

      const places = await mockGoogleServices.searchPlaces(text);
      setSuggestions(places);
    } catch (error) {
      console.error('Error searching places:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (place: Place) => {
    setSearchText(place.name);
    setShowSuggestions(false);
    onLocationSelect(place.name, place.location);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await mockGoogleServices.getCurrentLocation();
      const places = await mockGoogleServices.searchPlaces('Current Location');
      if (places.length > 0) {
        handleSelectLocation(places[0]);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <Input
          value={searchText}
          onChangeText={handleSearch}
          placeholder={placeholder}
          style={[styles.input, style]}
          placeholderTextColor={Colors.neutral.medium}
        />
        {loading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            color={Colors.primary.default}
          />
        )}
      </View>
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
          >
            <MapPin size={20} color={Colors.primary.default} />
            <Text style={styles.currentLocationText}>Use current location</Text>
          </TouchableOpacity>
          <ScrollView style={styles.suggestionsList}>
            {suggestions.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.suggestionItem}
                onPress={() => handleSelectLocation(place)}
              >
                <Text style={styles.suggestionName}>{place.name}</Text>
                <Text style={styles.suggestionAddress}>
                  {place.address}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.m,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Layout.spacing.s,
    color: Colors.neutral.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    color: Colors.neutral.black,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
  },
  loadingIndicator: {
    position: 'absolute',
    right: Layout.spacing.m,
  },
  suggestionsContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.m,
    marginTop: Layout.spacing.xs,
    maxHeight: 200,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  currentLocationText: {
    marginLeft: Layout.spacing.s,
    color: Colors.primary.default,
    fontSize: 16,
  },
  suggestionsList: {
    maxHeight: 150,
  },
  suggestionItem: {
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  suggestionName: {
    fontSize: 16,
    color: Colors.neutral.black,
    marginBottom: Layout.spacing.xs,
  },
  suggestionAddress: {
    fontSize: 14,
    color: Colors.neutral.medium,
  },
});
