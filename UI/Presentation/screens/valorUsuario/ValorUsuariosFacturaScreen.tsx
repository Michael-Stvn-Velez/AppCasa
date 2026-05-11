import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MobileContainer } from '../../../../Infrastructure/CompositionRoot/mobileContainer';
import { ScreenBackBar } from '../../components/ScreenBackBar';
import { etiquetaMesYAnio } from '../../meses';
import type { RootStackParamList } from '../../navigation/types';
import { appStyles, colors, spacing, typography } from '../../theme/appTheme';

type UsuarioRow = Awaited<ReturnType<MobileContainer['getUsuariosUseCase']['execute']>>[number];
type ValorRow = Awaited<ReturnType<MobileContainer['getValoresUsuarioByFacturaUseCase']['execute']>>[number];

type Props = {
  container: MobileContainer;
};

function consumoTexto(v: ValorRow | undefined): string {
  if (!v) return 'Sin consumo registrado';
  return v.consumoLuz.toLocaleString('es', { useGrouping: false, maximumFractionDigits: 10 });
}

export function ValorUsuariosFacturaScreen({ container }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'ValorUsuariosFactura'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const facturaId = route.params.facturaId;
  const insets = useSafeAreaInsets();
  const [periodo, setPeriodo] = useState('');
  const [usuariosActivos, setUsuariosActivos] = useState<UsuarioRow[]>([]);
  const [valoresPorUsuario, setValoresPorUsuario] = useState<Map<number, ValorRow>>(new Map());
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [factura, usuarios, valores] = await Promise.all([
        container.getFacturaCasaByIdUseCase.execute(facturaId),
        container.getUsuariosUseCase.execute(),
        container.getValoresUsuarioByFacturaUseCase.execute(facturaId),
      ]);
      if (!factura) {
        Alert.alert('Error', 'Factura no encontrada.');
        navigation.goBack();
        return;
      }
      setPeriodo(etiquetaMesYAnio(factura.anio, factura.mes));
      const activos = usuarios.filter((u) => u.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));
      setUsuariosActivos(activos);
      const map = new Map<number, ValorRow>();
      for (const v of valores) {
        map.set(v.idUsuario, v);
      }
      setValoresPorUsuario(map);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [container, facturaId, navigation]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const bottomPad = Math.max(insets.bottom, spacing.md);

  return (
    <View style={[styles.root, { paddingBottom: bottomPad }]}>
      <ScreenBackBar fallbackRoute="FacturaCasaMenu" />
      <Text style={styles.title}>Consumos por usuario</Text>
      <Text style={styles.sub}>{periodo}</Text>
      <Text style={styles.hint}>Pulsa un usuario para registrar o editar su consumo de luz.</Text>

      <View style={styles.listSection}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando…</Text>
        ) : (
          <FlatList
            data={usuariosActivos}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay usuarios activos. Activa usuarios en la lista de usuarios.</Text>
            }
            renderItem={({ item }) => {
              const v = valoresPorUsuario.get(item.id);
              return (
                <Pressable
                  style={[appStyles.card, styles.cardMargin]}
                  onPress={() =>
                    navigation.navigate({
                      name: 'ValorUsuarioForm',
                      params: { facturaId, usuarioId: item.id },
                    })
                  }
                  accessibilityRole="button">
                  <View style={styles.cardInner}>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    <Text style={styles.cardSub}>
                      Piso: {item.pisoDeLaCasa} · {item.esCasa ? 'Casa' : 'No es casa'}
                    </Text>
                    <Text style={styles.cardConsumo}>Consumo luz: {consumoTexto(v)}</Text>
                    {v ? (
                      <Text style={styles.badge}>Registrado — pulsa para editar</Text>
                    ) : (
                      <Text style={styles.badgeNuevo}>Pulsa para registrar</Text>
                    )}
                  </View>
                </Pressable>
              );
            }}
            contentContainerStyle={styles.listContent}
            style={styles.flatList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  title: {
    ...typography.subtitle,
    fontSize: 24,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
  sub: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  hint: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  listSection: { flex: 1, minHeight: 0, paddingHorizontal: spacing.md },
  flatList: { flex: 1 },
  loadingText: { textAlign: 'center', marginTop: spacing.xl, color: colors.textMuted },
  empty: { textAlign: 'center', marginTop: spacing.xxl, color: colors.textMuted, fontSize: 16 },
  listContent: { flexGrow: 1, paddingBottom: spacing.sm },
  cardMargin: { marginBottom: spacing.sm },
  cardInner: { padding: spacing.md },
  cardTitle: { fontSize: 19, fontWeight: '700', color: colors.textPrimary },
  cardSub: { marginTop: spacing.xs, color: colors.textSecondary, fontSize: 15 },
  cardConsumo: { marginTop: spacing.sm, fontSize: 16, color: colors.textPrimary },
  badge: { marginTop: spacing.sm, fontSize: 14, color: colors.primary, fontWeight: '600' },
  badgeNuevo: { marginTop: spacing.sm, fontSize: 14, color: colors.textMuted },
});
