import { CommonActions, useNavigation } from '@react-navigation/native';
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

export function AdminWelcomeScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [checking, setChecking] = useState(true);

  const verificar = useCallback(async () => {
    setChecking(true);
    try {
      const admin = await container.getAdminUseCase.execute();
      if (admin) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          }),
        );
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo verificar el administrador.');
    } finally {
      setChecking(false);
    }
  }, [container, navigation]);

  useEffect(() => {
    void verificar();
  }, [verificar]);

  const guardar = () => {
    Keyboard.dismiss();
    const n = nombre.trim();
    if (!n) {
      Alert.alert('Nombre requerido', 'Escribe cómo te gustaría que te llamáramos.');
      return;
    }
    void (async () => {
      try {
        await container.upsertAdminUseCase.execute(n);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          }),
        );
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo guardar.');
      }
    })();
  };

  if (checking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Comprobando…</Text>
      </View>
    );
  }

  return (
    <FormKeyboardAvoidingView style={styles.kavRoot}>
      <View style={styles.shell}>
        <ScreenBackBar fallbackRoute="Bootstrap" />
        <View style={styles.outer}>
          <View style={appStyles.adminFormPanel}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            contentContainerStyle={appStyles.adminFormPanelInner}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.welcome}>
              Bienvienid@ a APP Casa, cuentanos como te gustaria que te llamaramos:
            </Text>
            <TextInput
              {...systemKeyboardTextInputProps}
              style={[appStyles.input, styles.inputSpacing]}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              accessibilityLabel="Nombre del administrador"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Pressable style={appStyles.btnPrimary} onPress={guardar} accessibilityRole="button">
              <Text style={appStyles.btnPrimaryText}>Continuar</Text>
            </Pressable>
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
  welcome: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
  inputSpacing: { marginBottom: spacing.lg },
});
