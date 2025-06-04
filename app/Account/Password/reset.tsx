import React, { useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '@/services/auth';
import Button from '@/components/UI/Button';

interface Styles {
  container: ViewStyle;
  headerRow: ViewStyle;
  headerTitle: TextStyle;
  form: ViewStyle;
  description: TextStyle;
  inputGroup: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputError: TextStyle;
  errorText: TextStyle;
  submitBtn: ViewStyle;
}

export default function ResetPassword() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      code: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!formData.code) {
      newErrors.code = 'Verification code is required';
      isValid = false;
    } else if (formData.code.length !== 6) {
      newErrors.code = 'Code must be 6 digits';
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await resetPassword(
      phone || '',
      formData.code,
      formData.newPassword,
      formData.confirmPassword
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () => router.push('/Auth/Login'),
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to reset password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.description}>
          Enter the verification code sent to your phone and create a new
          password
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[styles.input, errors.code && styles.inputError]}
            value={formData.code}
            onChangeText={(value) => updateFormData('code', value)}
            placeholder="Enter 6-digit code"
            placeholderTextColor={Colors.neutral.light}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errors.code ? (
            <Text style={styles.errorText}>{errors.code}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={[styles.input, errors.newPassword && styles.inputError]}
            value={formData.newPassword}
            onChangeText={(value) => updateFormData('newPassword', value)}
            placeholder="Enter new password"
            placeholderTextColor={Colors.neutral.light}
            secureTextEntry
          />
          {errors.newPassword ? (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            placeholder="Confirm new password"
            placeholderTextColor={Colors.neutral.light}
            secureTextEntry
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <Button
          title="Reset Password"
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
  description: {
    color: Colors.neutral.white,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: Colors.neutral.white,
    fontSize: 15,
    fontWeight: '500',
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
  } as TextStyle,
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  } as TextStyle,
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 24,
  },
});
