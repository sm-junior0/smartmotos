import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Stack } from 'expo-router';

const ProfileSettings = () => {
  const [firstName, setFirstName] = useState('Emmanuel');
  const [lastName, setLastName] = useState('Kamana');
  const [email, setEmail] = useState('kamana@gmail.com');
  const [city, setCity] = useState('Kigali');
  const [phoneNumber, setPhoneNumber] = useState('+250 798 384 666');

  const handleSave = () => {
    // Handle save logic here
    console.log('Save button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile settings',
          headerStyle: { backgroundColor: colors.background.default },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
          placeholderTextColor={colors.text.secondary}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
          placeholderTextColor={colors.text.secondary}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={colors.text.secondary}
        />

        <Text style={styles.label}>City</Text>
        {/* City will likely be a dropdown/picker, using a simple text input for now */}
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor={colors.text.secondary}
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone number"
          keyboardType="phone-pad"
          placeholderTextColor={colors.text.secondary}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.md,
  },
  formContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.default,
    color: colors.text.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
  saveButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
}); 