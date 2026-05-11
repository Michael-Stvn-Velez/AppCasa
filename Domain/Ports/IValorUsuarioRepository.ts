import type { ValorUsuario, ValorUsuarioCreateInput } from '../Entities/ValorUsuario';

export interface IValorUsuarioRepository {
  create(input: ValorUsuarioCreateInput): Promise<ValorUsuario>;
  findById(id: number): Promise<ValorUsuario | null>;
  findByFacturaAndUsuario(idFacturaCasa: number, idUsuario: number): Promise<ValorUsuario | null>;
  findAllByFacturaId(idFacturaCasa: number): Promise<ValorUsuario[]>;
  update(valor: ValorUsuario): Promise<void>;
  delete(id: number): Promise<void>;
}
