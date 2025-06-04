import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import StatusMessage from '@/components/UI/StatusMessage';

export default function VerificationError() {
  const handleRetry = () => {
    router.back(); // Go back to verification screen
  };

  return (
    <View style={styles.container}>
      <StatusMessage
        type="error"
        title="Verification Failed"
        message="We couldn't verify your phone number. Please check the code and try again."
        buttonText="Try Again"
        onButtonPress={handleRetry}
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
