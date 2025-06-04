import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import StatusMessage from '@/components/UI/StatusMessage';

export default function VerificationSuccess() {
  const handleContinue = () => {
    router.replace('/Auth/Login');
  };

  return (
    <View style={styles.container}>
      <StatusMessage
        type="success"
        title="Phone Verified!"
        message="Your phone number has been successfully verified. You can now log in to your account."
        buttonText="Continue to Login"
        onButtonPress={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.default,
  },
});
