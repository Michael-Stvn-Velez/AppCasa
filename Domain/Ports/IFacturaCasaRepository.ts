import type { FacturaCasa, FacturaCasaCreateInput } from '../Entities/FacturaCasa';

export interface IFacturaCasaRepository {
  create(input: FacturaCasaCreateInput): Promise<FacturaCasa>;
  findAll(): Promise<FacturaCasa[]>;
  findById(id: number): Promise<FacturaCasa | null>;
  findByAnioMes(anio: number, mes: number): Promise<FacturaCasa | null>;
  update(factura: FacturaCasa): Promise<void>;
}
