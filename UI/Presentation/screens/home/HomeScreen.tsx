import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MobileContainer } from '../../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme/appTheme';

type Props = {
  container: MobileContainer;
};

export function HomeScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const admin = await container.getAdminUseCase.execute();
      if (!admin) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AdminWelcome' }],
          }),
        );
        return;
      }
      setNombre(admin.nombre);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo cargar el administrador.');
    } finally {
      setLoading(false);
    }
  }, [container, navigation]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const topPad = insets.top + spacing.xl;

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: topPad }]}>
        <Text style={styles.hint}>Cargando…</Text>
      </View>
    );
  }

  const bottomPad = Math.max(insets.bottom, spacing.lg);

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <View style={styles.main}>
        <View style={styles.contentBox}>
          <View style={styles.contentCluster}>
            <Text style={styles.welcomeTitle} accessibilityRole="header">
              {nombre ? `Bienvenid@, ${nombre}` : 'Bienvenid@.'}
            </Text>

            <View style={styles.actions}>
              <View style={styles.tileRow}>
                <Pressable
                  style={[styles.tile, { backgroundColor: colors.homeTileUsuario }]}
                  onPress={() => navigation.navigate({ name: 'UsuarioList', params: undefined })}
                  accessibilityRole="button"
                  accessibilityLabel="Administrador de usuario">
                  <Text style={styles.tileLabel}>Administra Usuarios</Text>
                </Pressable>
                <Pressable
                  style={[styles.tile, { backgroundColor: colors.primary }]}
                  onPress={() => {}}
                  accessibilityRole="button"
                  accessibilityLabel="Crear factura del mes">
                  <Text style={styles.tileLabel}>Generar Factura</Text>
                </Pressable>
              </View>

              <Pressable
                style={[styles.wideTile, { backgroundColor: colors.homeTileConfig }]}
                onPress={() => navigation.navigate({ name: 'AdminEdit', params: undefined })}
                accessibilityRole="button">
                <Text style={styles.tileLabel}>Configuracion Admin</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    minHeight: 0,
  },
  /** Contenedor tipo “caja”: superficie elevada sobre el fondo de pantalla. */
  contentBox: {
    width: '100%',
    minHeight: '66%',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  /** Desplaza el bloque título + acciones un poco hacia arriba dentro de la caja. */
  contentCluster: {
    width: '100%',
    marginTop: -spacing.lg,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: spacing.xxl + spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  actions: {
    gap: spacing.md,
    width: '100%',
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  tile: {
    flex: 1,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 118,
  },
  wideTile: {
    borderRadius: radii.lg,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    alignSelf: 'stretch',
  },
  tileLabel: {
    color: colors.onPrimary,
    ...typography.button,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 26,
    paddingHorizontal: spacing.xs,
  },
  hint: { textAlign: 'center', marginTop: 40, color: colors.textMuted },
});
