import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing } from '@/styles/theme';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import SocialAuthButtons from '@/components/UI/SocialAuthButtons';
import { login } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './context';

export default function Login() {
  const authContext = useContext(AuthContext);
  const [phone, setPhone] = useState('+250');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

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
    // if (!validateForm()) return;
    // setLoading(true);
    // const result = await login(phone, password);
    // if (result.success && result.data) {
    //   setLoading(false);
    //   const user = jwtDecode(result.data.token);
    //   authContext.setUser(user);
    //   router.push('/(tabs)');
    // } else {
    //   setLoading(false);
    //   Alert.alert('Login failed', result.error, [
    //     { text: 'OK', onPress: () => router.replace('/Auth/Login') },
    //   ]);
    // }
    router.push('/(tabs)');
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Passenger Login</Text>
        
        <View style={styles.form}>
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

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            variant="primary"
            size="large"
            loading={loading}
            style={styles.loginButton}
          />
        </View>

        <SocialAuthButtons
          onGooglePress={handleGoogleLogin}
          onFacebookPress={handleFacebookLogin}
          onApplePress={handleAppleLogin}
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
    justifyContent: 'center',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  signupText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  signupLink: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.primary.main,
  },
});
