import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/appTheme';

export function WebDbUnavailableScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>
        App Casa necesita SQLite en el dispositivo. Abre esta app en Android o iOS (emulador, Expo Go
        o build nativo).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textPrimary,
  },
});
