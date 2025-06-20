import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Stack, useRouter } from 'expo-router';
import { forgotDriverPassword } from '@/services/driver';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('+250');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePhoneChange = (value: string) => {
    if (value.startsWith('+250')) {
      setPhone(value);
    } else if (value.length < phone.length) {
      // If deleting, don't allow deleting the prefix
      setPhone('+250');
    } else {
      // If adding numbers, ensure prefix exists
      setPhone('+250' + value.replace('+250', ''));
    }
    // Clear error when typing
    if (error) setError('');
  };

  const validatePhone = () => {
    const phoneRegex = /^\+250[0-9]{9}$/;
    if (!phone) {
      setError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setError('Phone number must be in format: +250XXXXXXXXX');
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    if (!validatePhone()) return;

    setLoading(true);
    const result = await forgotDriverPassword(phone);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () =>
            router.push({
              pathname: '/driver/account/password/forgot/verify',
              params: { phone },
            }),
        },
      ]);
    } else {
      setError(result.error || 'Failed to send verification code');
    }
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
          style={[styles.input, error && styles.inputError]}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="+250XXXXXXXXX"
          placeholderTextColor={colors.text.secondary}
          keyboardType="phone-pad"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={handleSendCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary.contrastText} />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
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
  },
  formContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
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
  inputError: {
    borderWidth: 1,
    borderColor: colors.error.main,
  },
  errorText: {
    color: colors.error.main,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
});
