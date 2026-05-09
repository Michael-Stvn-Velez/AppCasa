import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../navigation/types';
import { appStyles, colors, spacing, typography } from '../theme/appTheme';

type Props = {
  container: MobileContainer;
};

export function HomeScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  if (loading) {
    return (
      <View style={styles.root}>
        <Text style={styles.hint}>Cargando…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.centerBlock}>
        <Text style={styles.welcome}>bienvenido {nombre}</Text>
      </View>
      <View style={styles.footer}>
        <Pressable
          style={appStyles.btnPrimary}
          onPress={() => navigation.navigate({ name: 'AdminEdit', params: undefined })}
          accessibilityRole="button">
          <Text style={appStyles.btnPrimaryText}>Cambiar mi nombre</Text>
        </Pressable>
        <Pressable
          style={[appStyles.btnPrimary, styles.footerBtnSpacing]}
          onPress={() => navigation.navigate({ name: 'UsuarioList', params: undefined })}
          accessibilityRole="button">
          <Text style={appStyles.btnPrimaryText}>Usuarios</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    ...typography.title,
    textAlign: 'center',
    color: colors.primary,
  },
  hint: { textAlign: 'center', marginTop: 40, color: colors.textMuted },
  footer: { paddingBottom: spacing.md },
  footerBtnSpacing: { marginTop: spacing.sm },
});
