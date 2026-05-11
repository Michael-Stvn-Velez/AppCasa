import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme/appTheme';

export type ScreenBackBarProps = {
  /** Texto visible (p. ej. "Atrás" o "Inicio"). */
  label?: string;
  /** Si no hay historial en el stack, navega a esta ruta. */
  fallbackRoute?: keyof RootStackParamList;
};

function navigateToRoute(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  route: keyof RootStackParamList,
): void {
  switch (route) {
    case 'UsuarioForm':
      navigation.navigate('UsuarioForm', {});
      return;
    case 'FacturaCasaForm':
      navigation.navigate('FacturaCasaForm', {});
      return;
    case 'WebDbUnavailable':
      navigation.navigate('WebDbUnavailable');
      return;
    case 'Bootstrap':
      navigation.navigate('Bootstrap');
      return;
    case 'AdminWelcome':
      navigation.navigate('AdminWelcome');
      return;
    case 'AdminEdit':
      navigation.navigate('AdminEdit');
      return;
    case 'Home':
      navigation.navigate('Home');
      return;
    case 'UsuarioList':
      navigation.navigate('UsuarioList');
      return;
    case 'FacturaCasaMenu':
      navigation.navigate('FacturaCasaMenu');
      return;
    case 'FacturaCasaHistorico':
      navigation.navigate('FacturaCasaHistorico');
      return;
    default:
      navigation.navigate(route);
  }
}

/**
 * Barra superior con acción para volver a la pantalla anterior (`goBack`),
 * o a `fallbackRoute` si el stack no permite retroceder.
 */
export function ScreenBackBar({ label = 'Atrás', fallbackRoute = 'Home' }: ScreenBackBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const onPress = useCallback(() => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigateToRoute(navigation, fallbackRoute);
    }
  }, [navigation, fallbackRoute]);

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.xs }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressablePressed]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: volver a la pantalla anterior`}>
        <Text style={styles.chevron}>‹</Text>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  pressablePressed: {
    opacity: 0.7,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.primary,
    marginRight: 2,
    fontWeight: '600',
  },
  label: {
    ...typography.subtitle,
    fontSize: 17,
    color: colors.primary,
  },
});
