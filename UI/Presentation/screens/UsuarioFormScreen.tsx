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
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../navigation/types';

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
      <Text style={styles.title}>{usuarioId == null ? 'Nuevo usuario' : 'Editar usuario'}</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre"
        autoCapitalize="words"
      />

      <Text style={styles.label}>Piso de la casa</Text>
      <TextInput
        style={styles.input}
        value={pisoDeLaCasa}
        onChangeText={setPisoDeLaCasa}
        placeholder="Ej. 3º B"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Es casa</Text>
        <Switch value={esCasa} onValueChange={setEsCasa} accessibilityLabel="Es casa" />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.secondary]}
          onPress={salir}
          accessibilityRole="button">
          <Text style={styles.secondaryText}>Cancelar</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.primary]}
          onPress={guardar}
          accessibilityRole="button">
          <Text style={styles.primaryText}>Guardar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { color: '#666' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  primary: { backgroundColor: '#1565c0' },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondary: { borderWidth: 1, borderColor: '#1565c0' },
  secondaryText: { color: '#1565c0', fontWeight: '600' },
});
