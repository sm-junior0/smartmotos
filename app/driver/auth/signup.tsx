import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { colors, typography, spacing } from '@/styles/theme';
import Button from '@/components/common/Button';
import InputField from '@/components/common/InputField';
import SocialButtons from '@/components/common/SocialButtons';
import { driverOnboarding } from '@/services/auth';
import CameraCapture from '../../../components/common/CameraCapture';
import { Image } from 'react-native';

export default function DriverSignupScreen() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    serviceProvider: '',
    vehicleType: '',
    licenseNumber: '',
  });
  const [serviceProvider, setServiceProvider] = useState<'MTN' | 'Airtel'>(
    'MTN'
  );
  const [vehicleType, setVehicleType] = useState<'bike' | 'car'>('bike');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }

    // Phone number validation
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (phoneNumber.replace(/\D/g, '').length < 10) {
      newErrors.phoneNumber = 'Invalid phone number';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!serviceProvider) {
      newErrors.serviceProvider = 'Service provider is required';
      valid = false;
    }
    if (!vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
      valid = false;
    }
    if (!licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
      valid = false;
    }
    if (!licenseImage) {
      alert('A clear photo of your license is required.');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);

    // Ensure phone number is properly formatted
    const formattedPhone = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+${phoneNumber}`;

    // Prepare form data for image upload
    let formData = new FormData();
    const data = {
      name: fullName.trim(),
      phone: formattedPhone,
      service_provider: serviceProvider,
      vehicle_type: vehicleType,
      license_number: licenseNumber,
      password: password,
      confirm_password: confirmPassword,
      email: email || undefined, // Only include if exists
    };

    // FIX: Append all fields as a JSON string under 'data'
    formData.append('data', JSON.stringify(data));

    // Append the license image
    if (licenseImage) {
      formData.append('license_image', {
        uri: licenseImage,
        name: 'license.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const result = await driverOnboarding(formData);

    setLoading(false);

    if (result.success) {
      router.replace({
        pathname: '/driver/auth/otp-verification',
        params: { phone: formattedPhone },
      });
    } else {
      alert(result.message || result.error || 'Signup failed');
    }
  };

  const handleSocialSignup = (provider: string) => {
    // Implement social signup logic
    console.log(`Signup with ${provider}`);
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
          <InputField
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
          />

          <InputField
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />

          <InputField
            placeholder="Email (Optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showPasswordToggle
            error={errors.password}
          />

          <InputField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            showPasswordToggle
            error={errors.confirmPassword}
          />

          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 4, color: colors.text.secondary }}>
              Service Provider
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setServiceProvider('MTN')}
                style={{ marginRight: 16 }}
              >
                <Text
                  style={{
                    color:
                      serviceProvider === 'MTN'
                        ? colors.primary.main
                        : colors.text.secondary,
                  }}
                >
                  MTN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setServiceProvider('Airtel')}>
                <Text
                  style={{
                    color:
                      serviceProvider === 'Airtel'
                        ? colors.primary.main
                        : colors.text.secondary,
                  }}
                >
                  Airtel
                </Text>
              </TouchableOpacity>
            </View>
            {errors.serviceProvider ? (
              <Text style={{ color: 'red' }}>{errors.serviceProvider}</Text>
            ) : null}
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 4, color: colors.text.secondary }}>
              Vehicle Type
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setVehicleType('bike')}
                style={{ marginRight: 16 }}
              >
                <Text
                  style={{
                    color:
                      vehicleType === 'bike'
                        ? colors.primary.main
                        : colors.text.secondary,
                  }}
                >
                  Bike
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVehicleType('car')}>
                <Text
                  style={{
                    color:
                      vehicleType === 'car'
                        ? colors.primary.main
                        : colors.text.secondary,
                  }}
                >
                  Car
                </Text>
              </TouchableOpacity>
            </View>
            {errors.vehicleType ? (
              <Text style={{ color: 'red' }}>{errors.vehicleType}</Text>
            ) : null}
          </View>

          <InputField
            placeholder="License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            error={errors.licenseNumber}
          />

          {/* License Image Capture Step */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 6, color: colors.text.secondary }}>
              License Photo (Required)
            </Text>
            {licenseImage ? (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: licenseImage }}
                  style={{
                    width: 220,
                    height: 120,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <Button
                  text="Retake Photo"
                  onPress={() => setShowCamera(true)}
                  style={{ marginBottom: 6 }}
                  fullWidth
                />
              </View>
            ) : (
              <Button
                text="Take Photo of License"
                onPress={() => setShowCamera(true)}
                fullWidth
                style={{ marginBottom: 6 }}
              />
            )}
          </View>

          {showCamera && (
            <CameraCapture
              onCapture={(uri: string) => {
                setLicenseImage(uri);
                setShowCamera(false);
              }}
              onCancel={() => setShowCamera(false)}
            />
          )}

          <Button
            text="Sign Up"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            style={styles.signupButton}
            disabled={!licenseImage}
          />
        </View>

        <SocialButtons
          onFacebookPress={() => handleSocialSignup('Facebook')}
          onTwitterPress={() => handleSocialSignup('Twitter')}
          onGooglePress={() => handleSocialSignup('Google')}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/driver/auth/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingTop: spacing.xl,
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
