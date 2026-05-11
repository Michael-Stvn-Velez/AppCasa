import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackBar } from '../../components/ScreenBackBar';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, radii, spacing, typography } from '../../theme/appTheme';

export function FacturaCasaMenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, spacing.md);

  return (
    <View style={styles.screen}>
      <ScreenBackBar fallbackRoute="Home" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}>
        <Text style={styles.title}>Facturas de la casa</Text>
        <Text style={styles.sub}>Elige una opción</Text>

        <View style={styles.card}>
          <Pressable
            style={[appStyles.btnPrimary, styles.optionBtn]}
            onPress={() => navigation.navigate({ name: 'FacturaCasaHistorico', params: undefined })}
            accessibilityRole="button"
            accessibilityLabel="Ver histórico de facturas">
            <Text style={appStyles.btnPrimaryText}>Ver histórico</Text>
          </Pressable>
          <Pressable
            style={[appStyles.btnPrimary, styles.optionBtn]}
            onPress={() => navigation.navigate({ name: 'FacturaCasaForm', params: {} })}
            accessibilityRole="button"
            accessibilityLabel="Crear nueva factura de la casa">
            <Text style={appStyles.btnPrimaryText}>Crear nueva factura de la casa</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 26,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  sub: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionBtn: { alignSelf: 'stretch' },
});
