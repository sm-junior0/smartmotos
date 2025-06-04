import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';
import VerificationInput from '@/components/UI/VerificationInput';
import { verifyPhone } from '@/services/auth';

export default function Verification() {
  const { phone } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    const result = await verifyPhone(phone as string, code);
    setLoading(false);

    if (result.success) {
      router.push('/Auth/VerificationSuccess');
    } else {
      router.push('/Auth/VerificationError');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phone}
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
