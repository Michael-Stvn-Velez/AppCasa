import type { FacturaCasa, FacturaCasaCreateInput } from '../../../Domain/Entities/FacturaCasa';
import type { IFacturaCasaRepository } from '../../../Domain/Ports/IFacturaCasaRepository';
import { getAppDatabase } from '../appDatabase';
import { facturaCasaSql } from './facturaCasaSql';

type FacturaCasaRow = {
  id: number;
  anio: number;
  mes: number;
  valor_luz: number;
  valor_aseo: number;
};

export class FacturaCasaRepositorySqlite implements IFacturaCasaRepository {
  private mapRow(row: FacturaCasaRow): FacturaCasa {
    return {
      id: row.id,
      anio: row.anio,
      mes: row.mes,
      valorLuz: row.valor_luz,
      valorAseo: row.valor_aseo,
    };
  }

  async create(input: FacturaCasaCreateInput): Promise<FacturaCasa> {
    const db = await getAppDatabase();
    const result = await db.runAsync(
      facturaCasaSql.insert,
      input.anio,
      input.mes,
      input.valorLuz,
      input.valorAseo,
    );
    const row = await db.getFirstAsync<FacturaCasaRow>(
      facturaCasaSql.selectById,
      result.lastInsertRowId,
    );
    if (!row) {
      throw new Error('No se pudo leer la factura recién creada.');
    }
    return this.mapRow(row);
  }

  async findAll(): Promise<FacturaCasa[]> {
    const db = await getAppDatabase();
    const rows = await db.getAllAsync<FacturaCasaRow>(facturaCasaSql.selectAllOrdered);
    return rows.map((r) => this.mapRow(r));
  }

  async findById(id: number): Promise<FacturaCasa | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<FacturaCasaRow>(facturaCasaSql.selectById, id);
    return row ? this.mapRow(row) : null;
  }

  async findByAnioMes(anio: number, mes: number): Promise<FacturaCasa | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<FacturaCasaRow>(
      facturaCasaSql.selectByAnioMes,
      anio,
      mes,
    );
    return row ? this.mapRow(row) : null;
  }

  async update(factura: FacturaCasa): Promise<void> {
    const db = await getAppDatabase();
    await db.runAsync(
      facturaCasaSql.update,
      factura.anio,
      factura.mes,
      factura.valorLuz,
      factura.valorAseo,
      factura.id,
    );
  }
}
