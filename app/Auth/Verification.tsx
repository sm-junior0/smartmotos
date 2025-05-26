import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';
import VerificationInput from '@/components/UI/VerificationInput';

export default function Verification() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    // Format as (XXX) XXX-XXXX if it's a 10 digit number
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate verification API call
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes: if code is "123456", it succeeds, otherwise fails
      if (code === '123456') {
        router.push('/Auth/VerificationSuccess');
      } else {
        router.push('/Auth/VerificationError');
      }
    }, 1500);
  };

  const handleResendCode = () => {
    if (timer > 0) return;
    
    // Reset timer
    setTimer(60);
    
    // Simulate resending code
    console.log('Resending code to', phone);
    
    // Start timer again
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>
          Please enter the 6-digit code sent to {formatPhone(phone || '')}
        </Text>

        <View style={styles.verificationSection}>
          <VerificationInput
            length={6}
            value={code}
            onChange={setCode}
            error={error}
          />
        </View>

        <Button
          title="Verify"
          onPress={handleVerify}
          variant="primary"
          size="large"
          loading={loading}
          style={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code?</Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={timer > 0}
          >
            <Text
              style={[
                styles.resendButton,
                timer > 0 && styles.resendButtonDisabled,
              ]}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.default,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral.lighter,
    marginBottom: Layout.spacing.xl,
  },
  verificationSection: {
    alignItems: 'center',
    marginVertical: Layout.spacing.l,
  },
  verifyButton: {
    marginTop: Layout.spacing.l,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.l,
  },
  resendText: {
    color: Colors.neutral.light,
    fontSize: 14,
  },
  resendButton: {
    color: Colors.primary.default,
    fontWeight: '600',
    marginLeft: Layout.spacing.xs,
    fontSize: 14,
  },
  resendButtonDisabled: {
    color: Colors.neutral.medium,
  },
});