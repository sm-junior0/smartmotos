import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '@/styles/theme';
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phone}
        </Text>
        
        <View style={styles.form}>
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
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  verifyButton: {
    marginTop: spacing.xl,
    width: '100%',
  },
});
