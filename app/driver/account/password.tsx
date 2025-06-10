import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, typography, spacing } from '@/styles/theme'

const Password = () => {
  return (
    <View style={styles.container}>
      <Link href="./password/change" asChild>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Change password</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.primary.main} />
        </TouchableOpacity>
      </Link>

      <View style={styles.divider} />

      <Link href="./password/forgot" asChild>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Forgot password</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.primary.main} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export default Password

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  menuItemText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
})