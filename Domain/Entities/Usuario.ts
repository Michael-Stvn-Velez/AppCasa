export type Usuario = {
  id: number;
  nombre: string;
  pisoDeLaCasa: string;
  esCasa: boolean;
  /** Si es false, el usuario queda registrado pero inactivo (p. ej. no participa en procesos vigentes). */
  activo: boolean;
};

export type UsuarioCreateInput = Omit<Usuario, 'id'>;
