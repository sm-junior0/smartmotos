import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronLeft, Smile, Mic, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SupportScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={Colors.primary.default} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer support</Text>
      </View>
      {/* Chat area */}
      <View style={styles.chatArea}>
        <View style={styles.supportRow}>
          <View style={styles.supportIcon}><Smile color={Colors.primary.default} size={22} /></View>
          <View style={styles.supportBubble}>
            <Text style={styles.supportText}>Hi, how can I help you?</Text>
          </View>
        </View>
      </View>
      {/* Input area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={24}>
        <View style={styles.inputArea}>
          <Text style={styles.inputLabel}>Enter message...</Text>
          <View style={styles.inputRow}>
            <TouchableOpacity><Smile color={Colors.primary.default} size={26} /></TouchableOpacity>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder=""
              placeholderTextColor={Colors.neutral.light}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Send color={Colors.primary.default} size={26} />
            </TouchableOpacity>
            <TouchableOpacity><Mic color={Colors.primary.default} size={26} /></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.default,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.neutral.white,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  chatArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: 16,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  supportIcon: {
    backgroundColor: Colors.secondary.default,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderWidth: 2,
    borderColor: Colors.primary.default,
  },
  supportBubble: {
    backgroundColor: Colors.primary.default,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  supportText: {
    color: Colors.secondary.default,
    fontSize: 15,
    fontWeight: '500',
  },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.dark,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: Colors.secondary.default,
  },
  inputLabel: {
    color: Colors.primary.default,
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary.default,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.secondary.default,
    marginHorizontal: 8,
  },
  sendBtn: {
    marginRight: 8,
  },
}); 