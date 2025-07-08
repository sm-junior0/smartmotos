import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase';
import { PhoneAuthProvider, signInWithPhoneNumber } from 'firebase/auth';
import Button from '@/components/UI/Button';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

interface Styles {
  container: ViewStyle;
  headerRow: ViewStyle;
  headerTitle: TextStyle;
  form: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputError: TextStyle;
  errorText: TextStyle;
  submitBtn: ViewStyle;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [phone, setPhone] = useState('+250');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const recaptchaVerifier = useRef(null);

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

  const handleSubmit = async () => {
    if (!validatePhone()) return;
    setLoading(true);
    console.log('Attempting to send SMS with phone:', phone);
    try {
      // Use Firebase Auth to send SMS with reCAPTCHA
      console.log('recaptchaVerifier.current:', recaptchaVerifier.current);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier.current
      );
      setLoading(false);
      console.log('SMS sent, confirmationResult:', confirmationResult);
      Alert.alert('Success', 'Verification code sent', [
        {
          text: 'OK',
          onPress: () =>
            router.push({
              pathname: '/Account/Password/reset',
              params: {
                phone,
                verificationId: confirmationResult.verificationId,
              },
            }),
        },
      ]);
    } catch (e: any) {
      setLoading(false);
      console.log('Error sending SMS:', e);
      setError(e.message || 'Failed to send verification code');
      Alert.alert('Error', e.message || 'Failed to send verification code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot password</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>
          Enter the phone number attached to your account
        </Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="+250XXXXXXXXX"
          placeholderTextColor={Colors.neutral.light}
          keyboardType="phone-pad"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title="Submit"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          loading={loading}
          style={styles.submitBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.default,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.neutral.white,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  form: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 16,
  },
  label: {
    color: Colors.neutral.white,
    fontSize: 15,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.secondary.default,
    fontWeight: '500',
    marginBottom: 8,
  } as TextStyle,
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  } as TextStyle,
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 16,
  },
});
