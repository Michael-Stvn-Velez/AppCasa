/**
 * Consumo de un usuario asociado a una factura de la casa.
 * Par (factura, usuario) único en almacenamiento.
 */
export type ValorUsuario = {
  id: number;
  idFacturaCasa: number;
  idUsuario: number;
  consumoLuz: number;
  /** Null mientras no aplique; si el usuario no es casa se persiste 0. */
  valorAseo: number | null;
};

export type ValorUsuarioCreateInput = Omit<ValorUsuario, 'id'>;
