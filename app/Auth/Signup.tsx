import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing } from '@/styles/theme';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import SocialAuthButtons from '@/components/UI/SocialAuthButtons';
import { signup } from '@/services/auth';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+250',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    if (value.startsWith('+250')) {
      setFormData((prev) => ({ ...prev, phone: value }));
    } else if (value.length < formData.phone.length) {
      // If deleting, don't allow deleting the prefix
      setFormData((prev) => ({ ...prev, phone: '+250' }));
    } else {
      // If adding numbers, ensure prefix exists
      setFormData((prev) => ({
        ...prev,
        phone: '+250' + value.replace('+250', ''),
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate phone number format: +250XXXXXXXXX
    const phoneRegex = /^\+250[0-9]{9}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be in format: +250XXXXXXXXX';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    // if (!validateForm()) return;

    // setLoading(true);
    // const result = await signup({
    //   name: formData.fullName,
    //   email: formData.email,
    //   phone: formData.phone,
    //   password: formData.password,
    //   confirm_password: formData.confirmPassword,
    // });

    // setLoading(false);

    // if (result.success) {
    //   Alert.alert('Success', result.message, [
    //     {
    //       text: 'OK',
    //       onPress: () =>
    //         router.push({
    //           pathname: '/Auth/Verification',
    //           params: { phone: formData.phone },
    //         }),
    //     },
    //   ]);
    // } else {
    //   Alert.alert('Error', result.error);
    // }
    router.push('/Auth/Verification');
  };

  const handleGoogleSignup = () => {
    // Implement Google signup
    console.log('Google signup');
  };

  const handleFacebookSignup = () => {
    // Implement Facebook signup
    console.log('Facebook signup');
  };

  const handleAppleSignup = () => {
    // Implement Apple signup
    console.log('Apple signup');
  };

  const navigateToLogin = () => {
    router.navigate('/Auth/Login');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Create New Account</Text>
        
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChangeText={(value) => updateFormData('fullName', value)}
            error={errors.fullName}
          />

          <Input
            label="Email"
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            error={errors.email}
          />

          <Input
            label="Phone Number"
            placeholder="+250XXXXXXXXX"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={handlePhoneChange}
            error={errors.phone}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            error={errors.confirmPassword}
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            variant="primary"
            size="large"
            loading={loading}
            style={styles.signupButton}
          />
        </View>

        <SocialAuthButtons
          onGooglePress={handleGoogleSignup}
          onFacebookPress={handleFacebookSignup}
          onApplePress={handleAppleSignup}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
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
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  signupButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  loginLink: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.primary.main,
  },
});
