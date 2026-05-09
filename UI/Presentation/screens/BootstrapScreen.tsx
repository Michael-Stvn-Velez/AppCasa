import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme/appTheme';

type Props = {
  container: MobileContainer;
};

type Phase = 'loading' | 'routing' | 'error';

export function BootstrapScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [phase, setPhase] = useState<Phase>('loading');
  const [detail, setDetail] = useState('Preparando carpeta y base de datos…');

  const routeAfterBootstrap = useCallback(async () => {
    setPhase('routing');
    setDetail('Comprobando administrador…');
    try {
      const admin = await container.getAdminUseCase.execute();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: admin ? 'Home' : 'AdminWelcome' }],
        }),
      );
    } catch (e) {
      setPhase('error');
      setDetail(e instanceof Error ? e.message : 'No se pudo continuar.');
    }
  }, [container, navigation]);

  const run = useCallback(async () => {
    setPhase('loading');
    setDetail('Preparando carpeta y base de datos…');
    try {
      await container.initializeLocalStorageUseCase.execute();
      await routeAfterBootstrap();
    } catch (e) {
      setPhase('error');
      setDetail(
        e instanceof Error ? e.message : 'No se pudo inicializar la base de datos.',
      );
    }
  }, [container, routeAfterBootstrap]);

  useEffect(() => {
    void run();
  }, [run]);

  return (
    <View style={styles.root}>
      {(phase === 'loading' || phase === 'routing') && (
        <View style={styles.block}>
          <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Cargando" />
          <Text style={styles.loadingTitle}>{phase === 'routing' ? 'Un momento…' : 'Cargando'}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
      )}
      {phase === 'error' && (
        <View style={styles.block}>
          <Text style={styles.errorTitle}>No se pudo completar</Text>
          <Text style={styles.errorBody}>{detail}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  block: {
    alignItems: 'center',
    maxWidth: 320,
  },
  loadingTitle: {
    marginTop: spacing.md,
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  detail: {
    marginTop: spacing.sm,
    textAlign: 'center',
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  errorTitle: {
    ...typography.subtitle,
    color: colors.error,
  },
  errorBody: {
    marginTop: spacing.sm,
    textAlign: 'center',
    ...typography.bodySmall,
    color: colors.error,
  },
});
