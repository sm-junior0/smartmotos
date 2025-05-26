import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';

export default function AccountDetails() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Jane');
  const [email, setEmail] = useState('gisele@mail.com');
  const [company, setCompany] = useState('SmartMotos');
  const [phone] = useState('+250 788 888 888');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account details</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>FirstName</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          placeholderTextColor={Colors.neutral.light}
        />
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
          placeholderTextColor={Colors.neutral.light}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={Colors.neutral.light}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Company name</Text>
        <View style={styles.dropdownWrap}>
          <TextInput
            style={[styles.input, { paddingRight: 32 }]}
            value={company}
            onChangeText={setCompany}
            placeholder="Company name"
            placeholderTextColor={Colors.neutral.light}
          />
          <ChevronDown size={20} color={Colors.neutral.dark} style={styles.dropdownIcon} />
        </View>
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={phone}
          editable={false}
        />
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
    paddingTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: 18,
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
  dropdownWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  disabledInput: {
    backgroundColor: Colors.neutral.light,
    color: Colors.secondary.default,
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