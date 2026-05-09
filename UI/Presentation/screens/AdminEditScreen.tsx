import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../navigation/types';
import { appStyles, colors, spacing, typography } from '../theme/appTheme';

type Props = {
  container: MobileContainer;
};

export function AdminEditScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const admin = await container.getAdminUseCase.execute();
      if (!admin) {
        Alert.alert('Error', 'No hay administrador registrado.');
        navigation.goBack();
        return;
      }
      setNombre(admin.nombre);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo cargar.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [container, navigation]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const guardar = () => {
    const n = nombre.trim();
    if (!n) {
      Alert.alert('Nombre requerido', 'El nombre no puede estar vacío.');
      return;
    }
    void (async () => {
      try {
        await container.upsertAdminUseCase.execute(n);
        navigation.goBack();
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo guardar.');
      }
    })();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Cargando…</Text>
      </View>
    );
  }

  return (
    <View style={styles.outer}>
      <View style={appStyles.adminFormPanel}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={appStyles.adminFormPanelInner}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Cambiar tu nombre</Text>
          <Text style={styles.sub}>Puedes actualizar cómo te llamamos en la app.</Text>
          <TextInput
            style={[appStyles.input, styles.inputSpacing]}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            accessibilityLabel="Nombre del administrador"
          />
          <View style={styles.actions}>
            <Pressable
              style={[appStyles.btnSecondary, styles.btnFlex]}
              onPress={() => navigation.goBack()}
              accessibilityRole="button">
              <Text style={appStyles.btnSecondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[appStyles.btnPrimary, styles.btnFlex]}
              onPress={guardar}
              accessibilityRole="button">
              <Text style={appStyles.btnPrimaryText}>Guardar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  hint: { color: colors.textMuted },
  title: { ...typography.subtitle, marginBottom: spacing.xs, color: colors.textPrimary },
  sub: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  inputSpacing: { marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-start' },
  btnFlex: { flex: 1 },
});
