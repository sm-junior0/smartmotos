import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import StatusMessage from '@/components/UI/StatusMessage';

export default function VerificationSuccess() {
  const handleContinue = () => {
    // Navigate to the main app after successful verification
    router.push('/(tabs)');
  };

  return (
    <StatusMessage
      type="success"
      title="Successful"
      message="Your account has been successfully verified. You can now access all features of the Smart Motos app."
      buttonText="Continue"
      onButtonPress={handleContinue}
    />
  );
}

const styles = StyleSheet.create({});