import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PasswordMain() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Password</Text>
      </View>
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Account/Password/change')}>
        <Text style={styles.rowText}>Change password</Text>
        <ChevronRight color={Colors.primary.default} size={22} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row} onPress={() => router.push('/Account/Password/forgot')}>
        <Text style={styles.rowText}>Forgot password</Text>
        <ChevronRight color={Colors.primary.default} size={22} />
      </TouchableOpacity>
      <View style={styles.divider} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: 22,
  },
  rowText: {
    color: Colors.neutral.white,
    fontSize: 17,
    fontWeight: '500',
  },
  divider: {
    height: 2,
    backgroundColor: Colors.primary.default,
    opacity: 0.7,
    marginHorizontal: Layout.spacing.xl,
  },
}); 