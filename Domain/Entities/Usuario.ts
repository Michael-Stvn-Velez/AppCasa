export type Usuario = {
  id: number;
  nombre: string;
  pisoDeLaCasa: string;
  esCasa: boolean;
};

export type UsuarioCreateInput = Omit<Usuario, 'id'>;
