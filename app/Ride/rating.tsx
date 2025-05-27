import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

export default function RatingScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRate = (value: number) => setRating(value);
  const handleSubmit = () => {
    // Submit rating logic here
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Ride</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRate(star)}>
            <Text style={[styles.star, rating >= star && styles.starSelected]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Leave a comment (optional)"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: Layout.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.l,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.l,
  },
  star: {
    fontSize: 36,
    color: Colors.neutral.light,
    marginHorizontal: 4,
  },
  starSelected: {
    color: Colors.primary.default,
  },
  input: {
    width: '100%',
    minHeight: 60,
    borderColor: Colors.neutral.lighter,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: Layout.spacing.l,
    fontSize: 16,
    color: Colors.secondary.default,
  },
  button: {
    backgroundColor: Colors.primary.default,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: Colors.neutral.white,
    fontSize: 18,
    fontWeight: '700',
  },
}); 