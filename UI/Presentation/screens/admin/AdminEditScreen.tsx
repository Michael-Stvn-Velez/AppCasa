import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { appStyles, colors, spacing, systemKeyboardTextInputProps, typography } from '../../theme/appTheme';

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
    Keyboard.dismiss();
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
    <FormKeyboardAvoidingView style={styles.kavRoot}>
      <View style={styles.shell}>
        <ScreenBackBar fallbackRoute="Home" />
        <View style={styles.outer}>
          <View style={appStyles.adminFormPanel}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            contentContainerStyle={appStyles.adminFormPanelInner}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Cambiar tu nombre</Text>
            <Text style={styles.sub}>Puedes actualizar cómo te llamamos en la app.</Text>
            <TextInput
              {...systemKeyboardTextInputProps}
              style={[appStyles.input, styles.input, styles.inputSpacing]}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              accessibilityLabel="Nombre del administrador"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <View style={styles.actions}>
              <Pressable
                style={[appStyles.btnSecondary, styles.btnFlex]}
                onPress={() => {
                  Keyboard.dismiss();
                  navigation.goBack();
                }}
                accessibilityRole="button">
                <Text style={[appStyles.btnSecondaryText, styles.btnText]}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[appStyles.btnPrimary, styles.btnFlex]}
                onPress={guardar}
                accessibilityRole="button">
                <Text style={[appStyles.btnPrimaryText, styles.btnText]}>Guardar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
        </View>
      </View>
    </FormKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kavRoot: { flex: 1, backgroundColor: colors.background },
  shell: { flex: 1, backgroundColor: colors.background },
  outer: {
    flex: 1,
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
  hint: { color: colors.textMuted, fontSize: 16 },
  title: { ...typography.title, fontSize: 28, marginBottom: spacing.xs, color: colors.textPrimary },
  sub: { ...typography.body, fontSize: 16, color: colors.textSecondary, marginBottom: spacing.lg },
  input: { fontSize: 18 },
  inputSpacing: { marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-start' },
  btnFlex: { flex: 1 },
  btnText: { fontSize: 18 },
});
