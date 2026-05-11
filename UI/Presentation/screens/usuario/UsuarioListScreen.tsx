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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MobileContainer } from '../../../../Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, spacing, typography } from '../../theme/appTheme';

type UsuarioItem = Awaited<
  ReturnType<MobileContainer['getUsuariosUseCase']['execute']>
>[number];

type Props = {
  container: MobileContainer;
};

export function UsuarioListScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
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

  const topPad = insets.top + spacing.lg;
  const bottomPad = Math.max(insets.bottom, spacing.md);

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <Text style={styles.title}>Usuarios</Text>

      <View style={styles.listSection}>
        {loading ? (
          <Text style={styles.hint}>Cargando…</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={<Text style={styles.empty}>No hay usuarios. Pulsa Nuevo.</Text>}
            renderItem={({ item }) => (
              <View style={[appStyles.card, styles.cardMargin]}>
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
            style={styles.flatList}
          />
        )}
      </View>

      <Pressable
        style={[appStyles.btnPrimary, styles.nuevoBtn]}
        onPress={() => navigation.navigate({ name: 'UsuarioForm', params: {} })}
        accessibilityRole="button">
        <Text style={appStyles.btnPrimaryText}>Nuevo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.subtitle,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  listSection: {
    flex: 1,
    minHeight: 0,
  },
  flatList: {
    flex: 1,
  },
  hint: { textAlign: 'center', marginTop: spacing.xl, color: colors.textMuted, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: spacing.xxl, color: colors.textMuted, fontSize: 16 },
  listContent: { flexGrow: 1, paddingBottom: spacing.sm },
  nuevoBtn: {
    marginTop: spacing.md,
  },
  cardMargin: { marginBottom: spacing.sm },
  cardMain: { padding: spacing.md },
  cardTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  cardSub: { marginTop: spacing.xs, color: colors.textSecondary, fontSize: 16 },
  deleteBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  deleteBtnText: { color: colors.error, fontWeight: '700', fontSize: 16 },
});
