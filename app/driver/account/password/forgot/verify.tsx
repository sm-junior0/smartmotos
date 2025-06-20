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
import React, { useState, useRef } from 'react';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { resetDriverPassword } from '@/services/driver';

const ForgotPasswordVerify = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to the next input field if a digit is entered
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (text === '' && index > 0) {
      // Move to the previous input field if the current one is cleared
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateForm = () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the complete verification code');
      return false;
    }
    if (!newPassword) {
      setError('New password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleVerifyCode = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await resetDriverPassword(
      phone || '',
      code.join(''),
      newPassword,
      confirmPassword
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () => router.replace('/driver/auth/login'),
        },
      ]);
    } else {
      setError(result.error || 'Failed to reset password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Verify Code',
          headerStyle: { backgroundColor: colors.background.default },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.formContainer}>
        <Text style={styles.label}>
          Enter the verification code sent to your phone
        </Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              placeholder="0"
              placeholderTextColor={colors.text.secondary}
            />
          ))}
        </View>

        <Text style={styles.label}>Enter new password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          placeholderTextColor={colors.text.secondary}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm new password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          placeholderTextColor={colors.text.secondary}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary.contrastText} />
          ) : (
            <Text style={styles.verifyButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordVerify;

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
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  codeInput: {
    backgroundColor: colors.background.default,
    color: colors.text.primary,
    width: 45,
    height: 45,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  input: {
    backgroundColor: colors.background.default,
    color: colors.text.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error.main,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  disabledButton: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
});
