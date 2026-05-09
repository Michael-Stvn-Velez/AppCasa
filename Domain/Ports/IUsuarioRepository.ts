import type { Usuario, UsuarioCreateInput } from '../Entities/Usuario';

export interface IUsuarioRepository {
  create(input: UsuarioCreateInput): Promise<Usuario>;
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  update(usuario: Usuario): Promise<void>;
  delete(id: number): Promise<void>;
}
