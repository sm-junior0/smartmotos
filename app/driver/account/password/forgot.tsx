import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { colors, typography, spacing, borderRadius } from '@/styles/theme'
import { Stack, useRouter } from 'expo-router'

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleSendCode = () => {
    // Handle sending code logic here
    console.log('Send code button pressed');
    router.push('./forgot/verify');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Forgot password',
          headerStyle: { backgroundColor: colors.background.default },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.formContainer}>
        <Text style={styles.label}>
          Enter the phone number attached to your account
        </Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone number"
          placeholderTextColor={colors.text.secondary}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSendCode}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background.default,
    color: colors.text.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.lg,
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
}); 