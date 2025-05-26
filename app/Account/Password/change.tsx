import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ChangePassword() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change password</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Enter old password</Text>
        <TextInput style={styles.input} value={oldPassword} onChangeText={setOldPassword} placeholder="Password" placeholderTextColor={Colors.neutral.light} secureTextEntry />
        <Text style={styles.label}>Enter new password</Text>
        <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Password" placeholderTextColor={Colors.neutral.light} secureTextEntry />
        <Text style={styles.label}>Confirm new password</Text>
        <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Password" placeholderTextColor={Colors.neutral.light} secureTextEntry />
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
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
  },
  input: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.secondary.default,
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.secondary.default,
    fontWeight: '700',
    fontSize: 18,
  },
}); 