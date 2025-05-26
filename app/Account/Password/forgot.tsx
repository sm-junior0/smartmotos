import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot password</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Enter the phone number attached to your account</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="" placeholderTextColor={Colors.neutral.light} keyboardType="phone-pad" />
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('/Account/Password/verify')}>
          <Text style={styles.saveText}>Submit</Text>
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
    marginBottom: 24,
  },
  saveBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.secondary.default,
    fontWeight: '700',
    fontSize: 18,
  },
}); 