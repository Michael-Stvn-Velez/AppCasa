import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';

type Props = {
  container: MobileContainer;
};

type Phase = 'loading' | 'success' | 'error';

export function LocalDatabaseInitScreen({ container }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [detail, setDetail] = useState('');

  const run = useCallback(async () => {
    setPhase('loading');
    setDetail('Preparando carpeta y base de datos…');
    try {
      await container.initializeLocalStorageUseCase.execute();
      setPhase('success');
      setDetail(
        'Base de datos creada o verificada correctamente (casa.db en el almacenamiento de la app).',
      );
    } catch (e) {
      setPhase('error');
      setDetail(
        e instanceof Error
          ? e.message
          : 'No se pudo inicializar la base de datos.',
      );
    }
  }, [container]);

  useEffect(() => {
    void run();
  }, [run]);

  return (
    <View style={styles.root}>
      {phase === 'loading' && (
        <View style={styles.block}>
          <ActivityIndicator size="large" accessibilityLabel="Cargando" />
          <Text style={styles.loadingTitle}>Cargando</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
      )}
      {phase === 'success' && (
        <View style={styles.block}>
          <Text style={styles.successTitle}>Correcto</Text>
          <Text style={styles.successBody}>{detail}</Text>
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
    padding: 24,
  },
  block: {
    alignItems: 'center',
    maxWidth: 320,
  },
  loadingTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  detail: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    color: '#444',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b5e20',
  },
  successBody: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 15,
    color: '#2e7d32',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b71c1c',
  },
  errorBody: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 15,
    color: '#c62828',
  },
});
