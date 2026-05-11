import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MobileContainer } from '../../../../Infrastructure/CompositionRoot/mobileContainer';
import { ScreenBackBar } from '../../components/ScreenBackBar';
import { etiquetaMesYAnio } from '../../meses';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, spacing, typography } from '../../theme/appTheme';

type FacturaItem = Awaited<
  ReturnType<MobileContainer['getFacturasCasaUseCase']['execute']>
>[number];

function formatoMoneda(valor: number): string {
  return valor.toLocaleString('es', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

type Props = {
  container: MobileContainer;
};

export function FacturaCasaHistoricoScreen({ container }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<FacturaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await container.getFacturasCasaUseCase.execute();
      setItems(list);
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'No se pudieron cargar las facturas.',
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

  const bottomPad = Math.max(insets.bottom, spacing.md);

  return (
    <View style={[styles.root, { paddingBottom: bottomPad }]}>
      <ScreenBackBar fallbackRoute="FacturaCasaMenu" />
      <Text style={styles.title}>Histórico de facturas</Text>

      <View style={styles.listSection}>
        {loading ? (
          <Text style={styles.hint}>Cargando…</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay facturas registradas. Crea una desde el menú.</Text>
            }
            renderItem={({ item }) => (
              <View style={[appStyles.card, styles.cardMargin]}>
                <View style={styles.cardInner}>
                  <Text style={styles.cardTitle}>{etiquetaMesYAnio(item.anio, item.mes)}</Text>
                  <Text style={styles.cardSub}>
                    Luz: {formatoMoneda(item.valorLuz)} · Aseo: {formatoMoneda(item.valorAseo)}
                  </Text>
                  <View style={styles.cardActions}>
                    <Pressable
                      style={[appStyles.btnSecondary, styles.btnHalf]}
                      onPress={() =>
                        navigation.navigate({
                          name: 'FacturaCasaForm',
                          params: { facturaId: item.id },
                        })
                      }
                      accessibilityRole="button">
                      <Text style={[appStyles.btnSecondaryText, styles.btnActionText]}>Editar factura</Text>
                    </Pressable>
                    <Pressable
                      style={[appStyles.btnPrimary, styles.btnHalf]}
                      onPress={() =>
                        navigation.navigate({
                          name: 'ValorUsuariosFactura',
                          params: { facturaId: item.id },
                        })
                      }
                      accessibilityRole="button">
                      <Text style={[appStyles.btnPrimaryText, styles.btnActionText]}>Consumos usuarios</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            style={styles.flatList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.subtitle,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
  listSection: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: spacing.md,
  },
  flatList: { flex: 1 },
  hint: { textAlign: 'center', marginTop: spacing.xl, color: colors.textMuted, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: spacing.xxl, color: colors.textMuted, fontSize: 16 },
  listContent: { flexGrow: 1, paddingBottom: spacing.sm },
  cardMargin: { marginBottom: spacing.sm },
  cardInner: { padding: spacing.md },
  cardTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  cardSub: { marginTop: spacing.xs, color: colors.textSecondary, fontSize: 16 },
  cardActions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btnHalf: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm },
  btnActionText: { fontSize: 15, textAlign: 'center' },
});
