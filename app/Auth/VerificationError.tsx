import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import StatusMessage from '@/components/UI/StatusMessage';

export default function VerificationError() {
  const handleRetry = () => {
    // Navigate back to verification screen
    router.navigate('/Auth/Verification');
  };

  return (
    <StatusMessage
      type="error"
      title="Error!"
      message="The verification code you entered is incorrect or has expired. Please check and try again."
      buttonText="Try Again"
      onButtonPress={handleRetry}
    />
  );
}

const styles = StyleSheet.create({});