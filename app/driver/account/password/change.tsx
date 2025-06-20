import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { Stack, useRouter } from 'expo-router';
import { changeDriverPassword } from '@/services/driver';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'All fields are required');
      return false;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (oldPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from old password');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await changeDriverPassword(
        oldPassword,
        newPassword,
        confirmNewPassword
      );

      if (result.success) {
        Alert.alert('Success', 'Password changed successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorMessage = result.error?.toLowerCase() || '';
        if (errorMessage.includes('old password is incorrect')) {
          Alert.alert('Error', 'Old password is incorrect');
        } else if (errorMessage.includes('passwords do not match')) {
          Alert.alert('Error', 'Passwords do not match');
        } else if (errorMessage.includes('new password must be different')) {
          Alert.alert(
            'Error',
            'New password must be different from old password'
          );
        } else {
          Alert.alert('Error', result.error || 'Failed to change password');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Change password',
          headerStyle: { backgroundColor: colors.background.default },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.formContainer}>
        <Text style={styles.label}>Enter old password</Text>
        <TextInput
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Password"
          placeholderTextColor={colors.text.secondary}
          secureTextEntry
        />

        <Text style={styles.label}>Enter new password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Password"
          placeholderTextColor={colors.text.secondary}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm new password</Text>
        <TextInput
          style={styles.input}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          placeholder="Password"
          placeholderTextColor={colors.text.secondary}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary.contrastText} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  formContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.default,
    color: colors.text.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
  saveButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
});
