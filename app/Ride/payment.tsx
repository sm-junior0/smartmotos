import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Wallet, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Button from '@/components/UI/Button';

const PAYMENT_METHODS = [
  {
    id: 'wallet',
    title: 'Wallet',
    icon: Wallet,
    balance: '24000 Rwf',
  },
  {
    id: 'card',
    title: 'Credit Card',
    icon: CreditCard,
    last4: '4242',
  },
];

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      router.push('/Ride/confirmation');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>

      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.selectedMethod,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <method.icon
            size={24}
            color={
              selectedMethod === method.id
                ? Colors.primary.default
                : Colors.neutral.dark
            }
          />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>{method.title}</Text>
            <Text style={styles.methodDetail}>
              {method.id === 'wallet' ? method.balance : `****${method.last4}`}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Base Fare</Text>
          <Text style={styles.summaryValue}>800 Rwf</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Distance (5.2 km)</Text>
          <Text style={styles.summaryValue}>200 Rwf</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>1000 Rwf</Text>
        </View>
      </View>

      <Button
        title="Pay Now"
        onPress={handlePayment}
        loading={loading}
        style={styles.payButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: Layout.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.l,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.l,
    backgroundColor: Colors.neutral.lightest,
    borderRadius: Layout.borderRadius.l,
    marginBottom: Layout.spacing.m,
  },
  selectedMethod: {
    backgroundColor: Colors.primary.light,
  },
  methodInfo: {
    marginLeft: Layout.spacing.l,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.xs,
  },
  methodDetail: {
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  summary: {
    marginTop: Layout.spacing.xl,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.l,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.m,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.secondary.default,
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: Colors.neutral.lighter,
    paddingTop: Layout.spacing.m,
    marginTop: Layout.spacing.m,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary.default,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary.default,
  },
  payButton: {
    marginTop: Layout.spacing.xl,
  },
});