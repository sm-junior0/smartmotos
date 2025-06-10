import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React, { useState, useRef } from 'react'
import { colors, typography, spacing, borderRadius } from '@/styles/theme'
import { Stack, useRouter } from 'expo-router'

const ForgotPasswordVerify = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);
  const router = useRouter();

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to the next input field if a digit is entered
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (text === '' && index > 0) {
      // Move to the previous input field if the current one is cleared
       inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const enteredCode = code.join('');
    // Handle code verification logic here
    console.log('Verify code button pressed with code:', enteredCode);
    // Navigate to the create new password screen on successful verification
    router.push('./forgot/create-new-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Forgot password',
          headerStyle: { backgroundColor: colors.background.default },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.contentContainer}>
        <Text style={styles.label}>
          Enter the 6-digit code we sent to your phone
        </Text>

        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              placeholderTextColor={colors.text.secondary}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.md,
  },
  contentContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    width: '80%', // Adjust width as needed
  },
  codeInput: {
    width: 40,
    height: 40,
    backgroundColor: colors.background.default,
    color: colors.text.primary,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  verifyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    width: '100%',
  },
  verifyButtonText: {
    color: colors.primary.contrastText,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
}); 