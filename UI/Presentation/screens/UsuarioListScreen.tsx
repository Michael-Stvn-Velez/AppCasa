import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../navigation/types';

type UsuarioItem = Awaited<
  ReturnType<MobileContainer['getUsuariosUseCase']['execute']>
>[number];

type Props = {
  container: MobileContainer;
};

export function UsuarioListScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<UsuarioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await container.getUsuariosUseCase.execute();
      setItems(list);
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'No se pudieron cargar los usuarios.',
      );
    } finally {
      setLoading(false);
    }
  }, [container]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const confirmarBorrar = (u: UsuarioItem) => {
    Alert.alert(
      'Eliminar usuario',
      `¿Eliminar a "${u.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await container.deleteUsuarioUseCase.execute(u.id);
                await reload();
              } catch (e) {
                Alert.alert(
                  'Error',
                  e instanceof Error ? e.message : 'No se pudo eliminar.',
                );
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate({ name: 'UsuarioForm', params: {} })}
          accessibilityRole="button">
          <Text style={styles.addBtnText}>Nuevo</Text>
        </Pressable>
      </View>
      {loading ? (
        <Text style={styles.hint}>Cargando…</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={styles.empty}>No hay usuarios. Pulsa Nuevo.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                onPress={() =>
                  navigation.navigate({
                    name: 'UsuarioForm',
                    params: { usuarioId: item.id },
                  })
                }
                accessibilityRole="button"
                style={styles.cardMain}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Text style={styles.cardSub}>
                  Piso: {item.pisoDeLaCasa} · {item.esCasa ? 'Casa' : 'No es casa'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => confirmarBorrar(item)}
                style={styles.deleteBtn}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${item.nombre}`}>
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '38%',
    alignItems: 'stretch',
    zIndex: 20,
    elevation: 20,
  },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  addBtn: {
    backgroundColor: '#1565c0',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 21,
    elevation: 21,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  hint: { textAlign: 'center', marginTop: 260, color: '#666' },
  empty: { textAlign: 'center', marginTop: 260, color: '#666' },
  listContent: { paddingTop: 260 },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  cardMain: { padding: 14 },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  cardSub: { marginTop: 4, color: '#444', fontSize: 14 },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deleteBtnText: { color: '#c62828', fontWeight: '600', fontSize: 14 },
});
