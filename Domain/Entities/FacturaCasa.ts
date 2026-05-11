/**
 * Factura mensual de servicios de la casa (solo período año-mes, sin día).
 * No se elimina del almacenamiento; solo se crea y actualiza.
 */
export type FacturaCasa = {
  id: number;
  anio: number;
  mes: number;
  valorLuz: number;
  valorAseo: number;
};

export type FacturaCasaCreateInput = Omit<FacturaCasa, 'id'>;
