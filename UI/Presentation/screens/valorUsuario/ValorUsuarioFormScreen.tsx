import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { MobileContainer } from '../../../../Infrastructure/CompositionRoot/mobileContainer';
import { FormKeyboardAvoidingView } from '../../components/FormKeyboardAvoidingView';
import { ScreenBackBar } from '../../components/ScreenBackBar';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, radii, spacing, systemKeyboardTextInputProps, typography } from '../../theme/appTheme';

type Props = {
  container: MobileContainer;
};

function parseDecimal(input: string): number {
  const t = input.trim().replace(/\s/g, '').replace(',', '.');
  return parseFloat(t);
}

export function ValorUsuarioFormScreen({ container }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'ValorUsuarioForm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { facturaId, usuarioId } = route.params;

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [esCasa, setEsCasa] = useState(true);
  const [consumoStr, setConsumoStr] = useState('');
  const [valorId, setValorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [usuario, existente] = await Promise.all([
        container.getUsuarioByIdUseCase.execute(usuarioId),
        container.getValorUsuarioByFacturaUsuarioUseCase.execute(facturaId, usuarioId),
      ]);
      if (!usuario) {
        Alert.alert('Error', 'Usuario no encontrado.');
        navigation.goBack();
        return;
      }
      if (!usuario.activo) {
        Alert.alert('Error', 'Este usuario no está activo.');
        navigation.goBack();
        return;
      }
      setNombreUsuario(usuario.nombre);
      setEsCasa(usuario.esCasa);
      if (existente) {
        setValorId(existente.id);
        setConsumoStr(
          existente.consumoLuz.toLocaleString('es', {
            useGrouping: false,
            maximumFractionDigits: 10,
          }),
        );
      } else {
        setValorId(null);
        setConsumoStr('');
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo cargar.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [container, facturaId, usuarioId, navigation]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const salir = useCallback(() => {
    Keyboard.dismiss();
    navigation.goBack();
  }, [navigation]);

  const guardar = () => {
    Keyboard.dismiss();
    const consumo = parseDecimal(consumoStr);
    if (Number.isNaN(consumo)) {
      Alert.alert('Datos incompletos', 'Indica un consumo de luz válido.');
      return;
    }
    void (async () => {
      try {
        if (valorId == null) {
          await container.createValorUsuarioUseCase.execute({
            idFacturaCasa: facturaId,
            idUsuario: usuarioId,
            consumoLuz: consumo,
          });
        } else {
          await container.updateValorUsuarioUseCase.execute({
            id: valorId,
            idFacturaCasa: facturaId,
            idUsuario: usuarioId,
            consumoLuz: consumo,
            valorAseo: esCasa ? null : 0,
          });
        }
        salir();
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo guardar.');
      }
    })();
  };

  const confirmarEliminar = () => {
    if (valorId == null) return;
    Alert.alert('Eliminar consumo', '¿Eliminar este registro de consumo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await container.deleteValorUsuarioUseCase.execute(valorId);
              salir();
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo eliminar.');
            }
          })();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Cargando…</Text>
      </View>
    );
  }

  return (
    <FormKeyboardAvoidingView style={styles.kavRoot}>
      <ScreenBackBar
        fallbackNavigate={() =>
          navigation.navigate('ValorUsuariosFactura', { facturaId })
        }
      />
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{valorId == null ? 'Registrar consumo' : 'Editar consumo'}</Text>
        <Text style={styles.sub}>{nombreUsuario}</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Consumo de luz</Text>
          <TextInput
            {...systemKeyboardTextInputProps}
            style={[appStyles.input, styles.field]}
            value={consumoStr}
            onChangeText={setConsumoStr}
            placeholder="Ej. 120,5"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Text style={styles.nota}>
            {esCasa
              ? 'Valor de aseo: pendiente (null) hasta definir reglas.'
              : 'Valor de aseo: se guarda automáticamente en 0 (no es casa).'}
          </Text>

          <View style={styles.actions}>
            <Pressable style={[appStyles.btnSecondary, styles.btnGrow]} onPress={salir} accessibilityRole="button">
              <Text style={[appStyles.btnSecondaryText, styles.btnText]}>Cancelar</Text>
            </Pressable>
            <Pressable style={[appStyles.btnPrimary, styles.btnGrow]} onPress={guardar} accessibilityRole="button">
              <Text style={[appStyles.btnPrimaryText, styles.btnText]}>Guardar</Text>
            </Pressable>
          </View>

          {valorId != null && (
            <Pressable
              style={[styles.deleteBtn]}
              onPress={confirmarEliminar}
              accessibilityRole="button">
              <Text style={styles.deleteBtnText}>Eliminar registro</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </FormKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kavRoot: { flex: 1, backgroundColor: colors.background },
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  hint: { color: colors.textMuted, fontSize: 16 },
  title: {
    ...typography.title,
    fontSize: 26,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sub: { ...typography.subtitle, textAlign: 'center', color: colors.textSecondary, marginBottom: spacing.lg },
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
  label: { ...typography.label, fontSize: 17, marginBottom: spacing.xs, color: colors.textPrimary },
  field: { marginBottom: spacing.md, fontSize: 18 },
  nota: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-start' },
  btnGrow: { flex: 1 },
  btnText: { fontSize: 18 },
  deleteBtn: { marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.sm },
  deleteBtnText: { color: colors.error, fontWeight: '700', fontSize: 16 },
});
