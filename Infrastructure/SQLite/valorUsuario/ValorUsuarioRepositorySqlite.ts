import type { ValorUsuario, ValorUsuarioCreateInput } from '../../../Domain/Entities/ValorUsuario';
import type { IValorUsuarioRepository } from '../../../Domain/Ports/IValorUsuarioRepository';
import { getAppDatabase } from '../appDatabase';
import { valorUsuarioSql } from './valorUsuarioSql';

type ValorUsuarioRow = {
  id: number;
  id_factura_casa: number;
  id_usuario: number;
  consumo_luz: number;
  valor_aseo: number | null;
};

export class ValorUsuarioRepositorySqlite implements IValorUsuarioRepository {
  private mapRow(row: ValorUsuarioRow): ValorUsuario {
    return {
      id: row.id,
      idFacturaCasa: row.id_factura_casa,
      idUsuario: row.id_usuario,
      consumoLuz: row.consumo_luz,
      valorAseo: row.valor_aseo === null || row.valor_aseo === undefined ? null : row.valor_aseo,
    };
  }

  async create(input: ValorUsuarioCreateInput): Promise<ValorUsuario> {
    const db = await getAppDatabase();
    const result = await db.runAsync(
      valorUsuarioSql.insert,
      input.idFacturaCasa,
      input.idUsuario,
      input.consumoLuz,
      input.valorAseo,
    );
    const row = await db.getFirstAsync<ValorUsuarioRow>(
      valorUsuarioSql.selectById,
      result.lastInsertRowId,
    );
    if (!row) {
      throw new Error('No se pudo leer el valor de usuario recién creado.');
    }
    return this.mapRow(row);
  }

  async findById(id: number): Promise<ValorUsuario | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<ValorUsuarioRow>(valorUsuarioSql.selectById, id);
    return row ? this.mapRow(row) : null;
  }

  async findByFacturaAndUsuario(
    idFacturaCasa: number,
    idUsuario: number,
  ): Promise<ValorUsuario | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<ValorUsuarioRow>(
      valorUsuarioSql.selectByFacturaUsuario,
      idFacturaCasa,
      idUsuario,
    );
    return row ? this.mapRow(row) : null;
  }

  async findAllByFacturaId(idFacturaCasa: number): Promise<ValorUsuario[]> {
    const db = await getAppDatabase();
    const rows = await db.getAllAsync<ValorUsuarioRow>(
      valorUsuarioSql.selectAllByFactura,
      idFacturaCasa,
    );
    return rows.map((r) => this.mapRow(r));
  }

  async update(valor: ValorUsuario): Promise<void> {
    const db = await getAppDatabase();
    await db.runAsync(
      valorUsuarioSql.update,
      valor.idFacturaCasa,
      valor.idUsuario,
      valor.consumoLuz,
      valor.valorAseo,
      valor.id,
    );
  }

  async delete(id: number): Promise<void> {
    const db = await getAppDatabase();
    await db.runAsync(valorUsuarioSql.deleteById, id);
  }
}
