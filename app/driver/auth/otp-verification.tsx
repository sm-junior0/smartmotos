import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '@/styles/theme';
import Button from '@/components/common/Button';
import OtpInput from '@/components/common/OtpInput';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { verifyDriverPhone } from '@/services/auth';

export default function OtpVerificationScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation for error message
  const shakeValue = useSharedValue(0);
  const errorOpacity = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeValue.value }],
    };
  });

  const errorStyle = useAnimatedStyle(() => {
    return {
      opacity: errorOpacity.value,
    };
  });

  // Validate phone number on mount
  useEffect(() => {
    if (!phone) {
      setError('Phone number is missing. Please go back and try again.');
      errorOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [phone]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setResendDisabled(false);
    }
  }, [timeLeft]);

  const handleVerifyOtp = async () => {
    if (!phone) {
      setError('Phone number is missing. Please go back and try again.');
      errorOpacity.value = withTiming(1, { duration: 300 });
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      errorOpacity.value = withTiming(1, { duration: 300 });
      shakeValue.value = withRepeat(withTiming(10, { duration: 100 }), 5, true);
      setTimeout(() => {
        shakeValue.value = withTiming(0);
      }, 500);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await verifyDriverPhone(phone as string, otp);
      setLoading(false);

      if (result.success) {
        // OTP verified, show success and go to driver login
        router.replace('/driver/auth/login');
      } else {
        setError(result.error || 'Verification failed');
        errorOpacity.value = withTiming(1, { duration: 300 });
        shakeValue.value = withRepeat(
          withTiming(10, { duration: 100 }),
          5,
          true
        );
        setTimeout(() => {
          shakeValue.value = withTiming(0);
        }, 500);
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
      errorOpacity.value = withTiming(1, { duration: 300 });
    }
  };

  const handleResendOtp = () => {
    if (!phone) {
      setError('Phone number is missing. Please go back and try again.');
      errorOpacity.value = withTiming(1, { duration: 300 });
      return;
    }

    // Reset timer and disable resend button
    setTimeLeft(60);
    setResendDisabled(true);

    // Clear any existing OTP and error
    setOtp('');
    setError('');

    // TODO: Implement resend OTP API call here
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Verification</Text>
        <Text style={styles.headerSubtitle}>
          {phone
            ? `We've sent a verification code to ${phone}`
            : 'Phone number is missing. Please go back and try again.'}
        </Text>

        <View style={styles.form}>
          <Animated.View style={shakeStyle}>
            <OtpInput length={6} value={otp} onChange={setOtp} autoFocus />
          </Animated.View>

          <Animated.Text style={[styles.errorText, errorStyle]}>
            {error}
          </Animated.Text>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {resendDisabled
                ? `Resend code in ${timeLeft}s`
                : "Didn't receive the code?"}
            </Text>

            {!resendDisabled && (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            text="Verify"
            onPress={handleVerifyOtp}
            loading={loading}
            fullWidth
            style={styles.verifyButton}
          />

          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.error.main,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  timerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  resendText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.primary.main,
  },
  verifyButton: {
    marginTop: spacing.lg,
  },
  backButton: {
    marginTop: spacing.lg,
  },
  backButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.primary.main,
  },
});
