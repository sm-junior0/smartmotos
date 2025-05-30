import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Check } from 'lucide-react-native';
import { useState } from 'react';

export default function WalletCard() {
  const [showTopUp, setShowTopUp] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('existing');

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Wallet Balance</Text>
        <View style={styles.amountRow}>
          <View style={styles.currencyContainer}>
            <Text style={styles.currencyText}>NGN</Text>
          </View>
          <Text style={styles.amount}>2400Rwf</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.topUpButton} onPress={() => setShowTopUp(true)}>
        <Text style={styles.topUpText}>Top up +</Text>
      </TouchableOpacity>

      {/* Top Up Modal */}
      <Modal visible={showTopUp} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Top up</Text>
            <Text style={styles.modalLabel}>Enter amount</Text>
            <TextInput
              style={styles.modalInput}
              value={topupAmount}
              onChangeText={setTopupAmount}
              placeholder=""
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.cardOption, selectedCard === 'existing' && styles.cardOptionSelected]}
              onPress={() => setSelectedCard('existing')}
            >
              <Text style={styles.cardOptionText}>Use bank card ***** **** **** 657</Text>
              {selectedCard === 'existing' && <Check color={Colors.primary.default} size={22} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardOption, selectedCard === 'new' && styles.cardOptionSelected]}
              onPress={() => setSelectedCard('new')}
            >
              <Text style={styles.cardOptionText}>Use a new card</Text>
              {selectedCard === 'new' && <Check color={Colors.primary.default} size={22} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalProceedBtn} onPress={() => setShowTopUp(false)}>
              <Text style={styles.modalProceedText}>Proceed</Text>
            </TouchableOpacity>
            <Pressable style={styles.modalCancelBtn} onPress={() => setShowTopUp(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
  },
  balanceContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: Colors.secondary.default,
    marginBottom: Layout.spacing.xs,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyContainer: {
    backgroundColor: Colors.secondary.default,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.s,
    marginRight: Layout.spacing.s,
  },
  currencyText: {
    color: Colors.neutral.white,
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary.default,
  },
  topUpButton: {
    backgroundColor: Colors.secondary.default,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderRadius: Layout.borderRadius.m,
  },
  topUpText: {
    color: Colors.neutral.white,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary.default,
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 16,
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: Colors.neutral.lightest,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.secondary.default,
    marginBottom: 24,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  cardOptionSelected: {
    borderColor: Colors.primary.default,
    backgroundColor: '#FFFBEA',
  },
  cardOptionText: {
    color: Colors.secondary.default,
    fontSize: 15,
    fontWeight: '600',
  },
  modalProceedBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalProceedText: {
    color: Colors.secondary.default,
    fontWeight: '700',
    fontSize: 18,
  },
  modalCancelBtn: {
    borderWidth: 1,
    borderColor: Colors.primary.default,
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
  },
  modalCancelText: {
    color: Colors.secondary.default,
    fontWeight: '700',
    fontSize: 18,
  },
});