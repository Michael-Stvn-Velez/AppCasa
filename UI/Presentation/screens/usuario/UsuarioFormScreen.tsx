import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { MobileContainer } from '../../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, radii, spacing, typography } from '../../theme/appTheme';

type Props = {
  container: MobileContainer;
};

export function UsuarioFormScreen({ container }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'UsuarioForm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const usuarioId = route.params?.usuarioId ?? null;

  const [nombre, setNombre] = useState('');
  const [pisoDeLaCasa, setPisoDeLaCasa] = useState('');
  const [esCasa, setEsCasa] = useState(false);
  const [loading, setLoading] = useState(!!usuarioId);

  const salir = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const cargar = useCallback(async () => {
    if (usuarioId == null) {
      setNombre('');
      setPisoDeLaCasa('');
      setEsCasa(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const u = await container.getUsuarioByIdUseCase.execute(usuarioId);
      if (!u) {
        Alert.alert('Error', 'Usuario no encontrado.');
        salir();
        return;
      }
      setNombre(u.nombre);
      setPisoDeLaCasa(u.pisoDeLaCasa);
      setEsCasa(u.esCasa);
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'No se pudo cargar el usuario.',
      );
      salir();
    } finally {
      setLoading(false);
    }
  }, [container, usuarioId, salir]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const guardar = () => {
    const n = nombre.trim();
    const p = pisoDeLaCasa.trim();
    if (!n || !p) {
      Alert.alert('Datos incompletos', 'Nombre y piso de la casa son obligatorios.');
      return;
    }
    void (async () => {
      try {
        if (usuarioId == null) {
          await container.createUsuarioUseCase.execute({
            nombre: n,
            pisoDeLaCasa: p,
            esCasa,
          });
        } else {
          await container.updateUsuarioUseCase.execute({
            id: usuarioId,
            nombre: n,
            pisoDeLaCasa: p,
            esCasa,
          });
        }
        salir();
      } catch (e) {
        Alert.alert(
          'Error',
          e instanceof Error ? e.message : 'No se pudo guardar.',
        );
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
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.formCard}>
        <Text style={styles.title}>{usuarioId == null ? 'Nuevo usuario' : 'Editar usuario'}</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[appStyles.input, styles.field]}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Piso de la casa</Text>
        <TextInput
          style={[appStyles.input, styles.field]}
          value={pisoDeLaCasa}
          onChangeText={setPisoDeLaCasa}
          placeholder="Ej. 3º B"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Es casa</Text>
          <Switch
            value={esCasa}
            onValueChange={setEsCasa}
            accessibilityLabel="Es casa"
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.actions}>
          <Pressable style={[appStyles.btnSecondary, styles.btnGrow]} onPress={salir} accessibilityRole="button">
            <Text style={[appStyles.btnSecondaryText, styles.btnText]}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[appStyles.btnPrimary, styles.btnGrow]}
            onPress={guardar}
            accessibilityRole="button">
            <Text style={[appStyles.btnPrimaryText, styles.btnText]}>Guardar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  formCard: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  hint: { color: colors.textMuted, fontSize: 16 },
  title: { ...typography.title, fontSize: 28, marginBottom: spacing.xl, color: colors.textPrimary },
  label: { ...typography.label, fontSize: 17, marginBottom: spacing.xs, color: colors.textPrimary },
  field: { marginBottom: spacing.md, fontSize: 18 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-start' },
  btnGrow: { flex: 1 },
  btnText: { fontSize: 18 },
});
