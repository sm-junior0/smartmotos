import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import SocialAuthButtons from '@/components/UI/SocialAuthButtons';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
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

  const handleSignup = () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to verification
      router.navigate({
        pathname: '/Auth/Verification',
        params: { phone: formData.phone },
      });
    }, 1500);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Account</Text>
      </View>

      <View style={styles.formContainer}>
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
          placeholder="(123) 456-7890"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(value) => updateFormData('phone', value)}
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

        <SocialAuthButtons
          onGooglePress={handleGoogleSignup}
          onFacebookPress={handleFacebookSignup}
          onApplePress={handleAppleSignup}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
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
    backgroundColor: Colors.secondary.default,
  },
  contentContainer: {
    paddingBottom: Layout.spacing.xl,
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
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
  },
  signupButton: {
    marginTop: Layout.spacing.m,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.l,
  },
  loginText: {
    color: Colors.neutral.light,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary.default,
    fontWeight: '600',
    marginLeft: Layout.spacing.xs,
    fontSize: 14,
  },
});