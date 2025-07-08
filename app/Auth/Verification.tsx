import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';
import VerificationInput from '@/components/UI/VerificationInput';
import { verifyPhone } from '@/services/auth';
import { auth } from '../firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { API_URL } from '@/config';

// Add a function to confirm the code and get the ID token
async function confirmCodeAndGetIdToken(verificationId: string, code: string) {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user.getIdToken();
}

export default function Verification() {
  const { phone, verificationId } = useLocalSearchParams();
  const verificationIdStr = Array.isArray(verificationId)
    ? verificationId[0]
    : verificationId;
  const phoneStr = Array.isArray(phone) ? phone[0] : phone;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    try {
      console.log('Attempting to confirm code:', { verificationIdStr, code });
      const idToken = await confirmCodeAndGetIdToken(verificationIdStr, code);
      console.log('Got idToken:', idToken);
      // Send idToken to backend for verification
      const response = await fetch(`${API_URL}/verify/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
      console.log(response);
      const result = await response.json();
      setLoading(false);
      if (result.success || result.message === 'Phone verified successfully') {
        router.push('/Auth/VerificationSuccess');
      } else {
        
        router.push('/Auth/VerificationError');
        console.log('Verification failed:', result);
      }
    } catch (e: any) {
      setLoading(false);
      console.log('Error during code confirmation:', e.message);
      
      router.push('/Auth/VerificationError');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneStr}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <VerificationInput length={6} value={code} onChange={setCode} />

        <Button
          title="Verify"
          onPress={handleVerification}
          variant="primary"
          size="large"
          loading={loading}
          style={styles.verifyButton}
        />
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
    marginBottom: Layout.spacing.s,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral.light,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
    alignItems: 'center',
  },
  verifyButton: {
    marginTop: Layout.spacing.xl,
    width: '100%',
  },
});
