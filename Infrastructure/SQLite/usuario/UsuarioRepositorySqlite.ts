import type { Usuario, UsuarioCreateInput } from '../../../Domain/Entities/Usuario';
import type { IUsuarioRepository } from '../../../Domain/Ports/IUsuarioRepository';
import { getAppDatabase } from '../appDatabase';
import { usuarioSql } from './usuarioSql';

type UsuarioRow = {
  id: number;
  nombre: string;
  piso_de_la_casa: string;
  es_casa: number;
  activo?: number;
};

export class UsuarioRepositorySqlite implements IUsuarioRepository {
  private mapRow(row: UsuarioRow): Usuario {
    return {
      id: row.id,
      nombre: row.nombre,
      pisoDeLaCasa: row.piso_de_la_casa,
      esCasa: row.es_casa === 1,
      activo: (row.activo ?? 1) === 1,
    };
  }

  async create(input: UsuarioCreateInput): Promise<Usuario> {
    const db = await getAppDatabase();
    const result = await db.runAsync(
      usuarioSql.insert,
      input.nombre,
      input.pisoDeLaCasa,
      input.esCasa ? 1 : 0,
      input.activo ? 1 : 0,
    );
    const row = await db.getFirstAsync<UsuarioRow>(
      usuarioSql.selectById,
      result.lastInsertRowId,
    );
    if (!row) {
      throw new Error('No se pudo leer el usuario recién creado.');
    }
    return this.mapRow(row);
  }

  async findAll(): Promise<Usuario[]> {
    const db = await getAppDatabase();
    const rows = await db.getAllAsync<UsuarioRow>(usuarioSql.selectAllOrdered);
    return rows.map((r) => this.mapRow(r));
  }

  async findById(id: number): Promise<Usuario | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<UsuarioRow>(usuarioSql.selectById, id);
    return row ? this.mapRow(row) : null;
  }

  async update(usuario: Usuario): Promise<void> {
    const db = await getAppDatabase();
    await db.runAsync(
      usuarioSql.update,
      usuario.nombre,
      usuario.pisoDeLaCasa,
      usuario.esCasa ? 1 : 0,
      usuario.activo ? 1 : 0,
      usuario.id,
    );
  }

  async delete(id: number): Promise<void> {
    const db = await getAppDatabase();
    await db.runAsync(usuarioSql.deleteById, id);
  }
}
