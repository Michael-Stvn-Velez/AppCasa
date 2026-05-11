import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { appStyles, colors, inputMetrics, radii, spacing, typography } from '../theme/appTheme';
import { nombreMes, OPCIONES_MES, type MesCalendarioOpcion } from './mesesCalendario';

export type MesPickerFieldProps = {
  label: string;
  /** Número de mes 1–12, o null si aún no hay selección. */
  value: number | null;
  onChange: (mes: number) => void;
  placeholder?: string;
  modalTitle?: string;
  /** Estilo extra para el contenedor del campo (p. ej. margen inferior del formulario). */
  fieldStyle?: StyleProp<ViewStyle>;
};

export function MesPickerField({
  label,
  value,
  onChange,
  placeholder = 'Selecciona un mes',
  modalTitle = 'Elige el mes',
  fieldStyle,
}: MesPickerFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[appStyles.input, styles.field, styles.selectTrigger, fieldStyle]}
        onPress={() => {
          Keyboard.dismiss();
          setVisible(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={
          value != null ? `Mes seleccionado: ${nombreMes(value)}` : 'Seleccionar mes'
        }>
        <Text style={value != null ? styles.selectText : styles.selectPlaceholder} numberOfLines={1}>
          {value != null ? nombreMes(value) : placeholder}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.modalBackdropFill}
            onPress={() => setVisible(false)}
            accessibilityLabel="Cerrar selector de mes"
          />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={OPCIONES_MES as MesCalendarioOpcion[]}
              keyExtractor={(item) => String(item.num)}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.mesRow, value === item.num && styles.mesRowSelected]}
                  onPress={() => {
                    onChange(item.num);
                    setVisible(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: value === item.num }}>
                  <Text
                    style={[styles.mesRowText, value === item.num && styles.mesRowTextSelected]}>
                    {item.nombre}
                  </Text>
                </Pressable>
              )}
              style={styles.mesList}
            />
            <Pressable
              style={[appStyles.btnSecondary, styles.modalCerrar]}
              onPress={() => setVisible(false)}
              accessibilityRole="button">
              <Text style={appStyles.btnSecondaryText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, fontSize: 17, marginBottom: spacing.xs, color: colors.textPrimary },
  field: { marginBottom: spacing.md, fontSize: 18 },
  selectTrigger: {
    justifyContent: 'center',
  },
  selectText: {
    fontSize: inputMetrics.fontSize,
    color: colors.textPrimary,
  },
  selectPlaceholder: {
    fontSize: inputMetrics.fontSize,
    color: colors.textMuted,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalBackdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 31, 61, 0.45)',
  },
  modalCard: {
    maxHeight: '72%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    overflow: 'hidden',
    zIndex: 1,
  },
  modalTitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  mesList: { maxHeight: 360 },
  mesRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  mesRowSelected: {
    backgroundColor: colors.background,
  },
  mesRowText: {
    fontSize: 17,
    color: colors.textPrimary,
  },
  mesRowTextSelected: {
    fontWeight: '700',
    color: colors.primary,
  },
  modalCerrar: {
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
});
