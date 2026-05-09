import { StyleSheet } from 'react-native';

/** Colores de marca y superficies (capa presentación). */
export const colors = {
  primary: '#452E5A',
  onPrimary: '#FFFFFF',
  surface: '#FFFFFF',
  background: '#F6F4F8',
  border: '#D8D0E0',
  borderFocus: '#452E5A',
  textPrimary: '#2D1F3D',
  textSecondary: '#5C4D6B',
  textMuted: '#7A6B88',
  error: '#B71C1C',
  errorBackground: '#FFEBEE',
  cardBackground: '#FFFFFF',
  cardBorder: '#E8E2EF',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600' as const },
  button: { fontSize: 16, fontWeight: '700' as const },
} as const;

/** Tamaños unificados para campos de texto. */
export const inputMetrics = {
  minHeight: 48,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  fontSize: 16,
  borderWidth: 1,
  borderRadius: radii.md,
} as const;

/**
 * Estilos reutilizables. Importar en pantallas con `...appStyles` o por nombre.
 */
export const appStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenPadded: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  input: {
    minHeight: inputMetrics.minHeight,
    paddingHorizontal: inputMetrics.paddingHorizontal,
    paddingVertical: inputMetrics.paddingVertical,
    fontSize: inputMetrics.fontSize,
    borderWidth: inputMetrics.borderWidth,
    borderColor: colors.border,
    borderRadius: inputMetrics.borderRadius,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  btnPrimaryText: {
    color: colors.onPrimary,
    ...typography.button,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  btnSecondaryText: {
    color: colors.primary,
    ...typography.button,
  },
  /** Formularios admin: 96% del ancho de pantalla, 50% del alto. */
  adminFormPanel: {
    width: '96%',
    height: '50%',
    maxWidth: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  adminFormPanelInner: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
});
