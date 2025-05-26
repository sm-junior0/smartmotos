import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (val: string, idx: number) => {
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[idx] = val;
      setCode(newCode);
      // Auto-focus next
      if (val && idx < 5) {
        const next = document.getElementById(`code-${idx + 1}`);
        if (next) (next as any).focus();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot password</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Enter the 6-digit code we sent to your phone</Text>
        <View style={styles.codeRow}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              id={`code-${idx}`}
              style={styles.codeInput}
              value={digit}
              onChangeText={val => handleChange(val, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('/Account/Password/reset')}>
          <Text style={styles.saveText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  label: {
    color: Colors.neutral.white,
    fontSize: 15,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  codeInput: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    width: 48,
    height: 48,
    fontSize: 24,
    color: Colors.secondary.default,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  saveBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  saveText: {
    color: Colors.secondary.default,
    fontWeight: '700',
    fontSize: 18,
  },
}); 