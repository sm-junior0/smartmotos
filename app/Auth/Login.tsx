import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import SocialAuthButtons from '@/components/UI/SocialAuthButtons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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

  const handleLogin = () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to the main app after successful login
      router.push('/(tabs)');
    }, 1500);
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
          label="Email"
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
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

        <TouchableOpacity onPress={() => console.log('Forgot password')}>
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