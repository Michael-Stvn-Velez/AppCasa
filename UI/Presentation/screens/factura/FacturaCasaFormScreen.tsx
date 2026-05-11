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
import { MesPickerField } from '../../meses';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, radii, spacing, systemKeyboardTextInputProps, typography } from '../../theme/appTheme';

type Props = {
  container: MobileContainer;
};

function parseDecimal(input: string): number {
  const t = input.trim().replace(/\s/g, '').replace(',', '.');
  return parseFloat(t);
}

export function FacturaCasaFormScreen({ container }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'FacturaCasaForm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const facturaId = route.params?.facturaId ?? null;

  const [anio, setAnio] = useState('');
  /** Número de mes 1–12; null = aún no elegido (solo alta). */
  const [mesNumero, setMesNumero] = useState<number | null>(null);
  const [valorLuz, setValorLuz] = useState('');
  const [valorAseo, setValorAseo] = useState('');
  const [loading, setLoading] = useState(!!facturaId);

  const esEdicion = facturaId != null;

  const salir = useCallback(() => {
    Keyboard.dismiss();
    navigation.goBack();
  }, [navigation]);

  const cargar = useCallback(async () => {
    if (facturaId == null) {
      setAnio('');
      setMesNumero(null);
      setValorLuz('');
      setValorAseo('');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const f = await container.getFacturaCasaByIdUseCase.execute(facturaId);
      if (!f) {
        Alert.alert('Error', 'Factura no encontrada.');
        salir();
        return;
      }
      setAnio(String(f.anio));
      setMesNumero(f.mes);
      setValorLuz(
        f.valorLuz.toLocaleString('es', { useGrouping: false, maximumFractionDigits: 10 }),
      );
      setValorAseo(
        f.valorAseo.toLocaleString('es', { useGrouping: false, maximumFractionDigits: 10 }),
      );
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'No se pudo cargar la factura.',
      );
      salir();
    } finally {
      setLoading(false);
    }
  }, [container, facturaId, salir]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const guardar = () => {
    Keyboard.dismiss();
    const anioN = parseInt(anio.trim(), 10);
    const luzN = parseDecimal(valorLuz);
    const aseoN = parseDecimal(valorAseo);

    if (mesNumero == null) {
      Alert.alert('Datos incompletos', 'Selecciona un mes.');
      return;
    }

    if (Number.isNaN(anioN) || Number.isNaN(luzN) || Number.isNaN(aseoN)) {
      Alert.alert('Datos incompletos', 'Año y valores deben ser números válidos.');
      return;
    }

    void (async () => {
      try {
        if (facturaId == null) {
          await container.createFacturaCasaUseCase.execute({
            anio: anioN,
            mes: mesNumero,
            valorLuz: luzN,
            valorAseo: aseoN,
          });
        } else {
          await container.updateFacturaCasaUseCase.execute({
            id: facturaId,
            anio: anioN,
            mes: mesNumero,
            valorLuz: luzN,
            valorAseo: aseoN,
          });
        }
        salir();
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
    <FormKeyboardAvoidingView style={styles.kavRoot}>
      <ScreenBackBar fallbackRoute="FacturaCasaMenu" />
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{esEdicion ? 'Editar factura' : 'Nueva factura de la casa'}</Text>
        <View style={styles.formCard}>

          <Text style={styles.label}>Año</Text>
          <TextInput
            {...systemKeyboardTextInputProps}
            style={[appStyles.input, styles.field]}
            value={anio}
            onChangeText={setAnio}
            placeholder="Ej. 2025"
            placeholderTextColor={colors.textMuted}
            maxLength={4}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <MesPickerField label="Mes" value={mesNumero} onChange={setMesNumero} />

          <Text style={styles.label}>Valor luz</Text>
          <TextInput
            {...systemKeyboardTextInputProps}
            style={[appStyles.input, styles.field]}
            value={valorLuz}
            onChangeText={setValorLuz}
            placeholder="Ej. 125000,50"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Text style={styles.label}>Valor aseo</Text>
          <TextInput
            {...systemKeyboardTextInputProps}
            style={[appStyles.input, styles.field]}
            value={valorAseo}
            onChangeText={setValorAseo}
            placeholder="Ej. 45000"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <View style={styles.actions}>
            <Pressable style={[appStyles.btnSecondary, styles.btnGrow]} onPress={salir} accessibilityRole="button">
              <Text style={[appStyles.btnSecondaryText, styles.btnText]}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[appStyles.btnPrimary, styles.btnGrow]}
              onPress={guardar}
              accessibilityRole="button">
              <Text style={[appStyles.btnPrimaryText, styles.btnText]}>
                {esEdicion ? 'Guardar' : 'Crear'}
              </Text>
            </Pressable>
          </View>
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
  title: { ...typography.title, fontSize: 28, marginBottom: spacing.xl, color: colors.textPrimary, textAlign:'center' },
  label: { ...typography.label, fontSize: 17, marginBottom: spacing.xs, color: colors.textPrimary },
  field: { marginBottom: spacing.md, fontSize: 18 },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-start', marginTop: spacing.md },
  btnGrow: { flex: 1 },
  btnText: { fontSize: 18 },
});
