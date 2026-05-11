/**
 * Meses del calendario (1–12) con etiquetas en español para UI.
 * El dominio y la BD guardan solo el número del mes; aquí se resuelve el nombre.
 */

export type MesCalendarioOpcion = {
  readonly num: number;
  readonly nombre: string;
};

export const OPCIONES_MES: readonly MesCalendarioOpcion[] = [
  { num: 1, nombre: 'Enero' },
  { num: 2, nombre: 'Febrero' },
  { num: 3, nombre: 'Marzo' },
  { num: 4, nombre: 'Abril' },
  { num: 5, nombre: 'Mayo' },
  { num: 6, nombre: 'Junio' },
  { num: 7, nombre: 'Julio' },
  { num: 8, nombre: 'Agosto' },
  { num: 9, nombre: 'Septiembre' },
  { num: 10, nombre: 'Octubre' },
  { num: 11, nombre: 'Noviembre' },
  { num: 12, nombre: 'Diciembre' },
] as const;

/** Nombre del mes en español; cadena vacía si `mes` no está entre 1 y 12. */
export function nombreMes(mes: number): string {
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
    return '';
  }
  return OPCIONES_MES[mes - 1]?.nombre ?? '';
}

export function esMesValido(mes: number): boolean {
  return Number.isInteger(mes) && mes >= 1 && mes <= 12;
}

/** Texto de período para listados (p. ej. factura: mes guardado en BD + año). */
export function etiquetaMesYAnio(anio: number, mes: number): string {
  const n = nombreMes(mes);
  return n ? `${n} ${anio}` : `${anio}-${mes}`;
}
