import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import SocialAuthButtons from '@/components/UI/SocialAuthButtons';
import { useAuth } from '@/hooks/AuthContext';
import { rideService } from '@/services/ride';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.default,
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
  loginButton: {
    marginTop: Layout.spacing.m,
  },
  forgotPassword: {
    color: Colors.primary.default,
    textAlign: 'right',
    marginTop: Layout.spacing.m,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.xxl,
  },
  signupText: {
    color: Colors.neutral.light,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary.default,
    fontWeight: '600',
    marginLeft: Layout.spacing.xs,
    fontSize: 14,
  },
});

export default function Login() {
  const { signIn, user } = useAuth();
  const [phone, setPhone] = useState('+250');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Map 'passenger' role to 'rider' for the ride service
      const rideServiceUser = {
        ...user,
        role: 'rider' as const,
      };
      rideService.setCurrentUser(rideServiceUser);
    }
  }, [user]);

  const handlePhoneChange = (value: string) => {
    if (value.startsWith('+250')) {
      setPhone(value);
    } else if (value.length < phone.length) {
      // If deleting, don't allow deleting the prefix
      setPhone('+250');
    } else {
      // If adding numbers, ensure prefix exists
      setPhone('+250' + value.replace('+250', ''));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { phone: '', password: '' };

    // Validate phone number format: +250XXXXXXXXX
    const phoneRegex = /^\+250[0-9]{9}$/;
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be in format: +250XXXXXXXXX';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const result = await signIn(phone, password);
    setLoading(false);

    if (result.success) {
      router.push('/(tabs)');
    } else {
      Alert.alert(
        'Login failed',
        result.error || 'An error occurred during login',
        [{ text: 'OK' }]
      );
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login
    console.log('Facebook login');
  };

  const handleAppleLogin = () => {
    // Implement Apple login
    console.log('Apple login');
  };

  const navigateToSignup = () => {
    router.push('/Auth/Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Passenger Login</Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Phone"
          placeholder="+250XXXXXXXXX"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={phone}
          onChangeText={handlePhoneChange}
          error={errors.phone}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          size="large"
          loading={loading}
          style={styles.loginButton}
        />

        <TouchableOpacity
          onPress={() => router.push('/Account/Password/forgot')}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <SocialAuthButtons
          onGooglePress={handleGoogleLogin}
          onFacebookPress={handleFacebookLogin}
          onApplePress={handleAppleLogin}
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
