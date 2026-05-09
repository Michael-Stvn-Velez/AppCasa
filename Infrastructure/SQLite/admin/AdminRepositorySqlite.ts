import type { Admin } from '../../../Domain/Entities/Admin';
import type { IAdminRepository } from '../../../Domain/Ports/IAdminRepository';
import { getAppDatabase } from '../appDatabase';
import { adminSql } from './adminSql';

type AdminRow = {
  id: number;
  nombre: string;
};

export class AdminRepositorySqlite implements IAdminRepository {
  async getSingleton(): Promise<Admin | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<AdminRow>(adminSql.selectById1);
    if (!row) {
      return null;
    }
    return { id: 1, nombre: row.nombre };
  }

  async upsertNombre(nombre: string): Promise<Admin> {
    const trimmed = nombre.trim();
    if (!trimmed) {
      throw new Error('El nombre no puede estar vacío.');
    }
    const db = await getAppDatabase();
    await db.runAsync(adminSql.upsert, trimmed);
    const row = await db.getFirstAsync<AdminRow>(adminSql.selectById1);
    if (!row) {
      throw new Error('No se pudo leer el administrador.');
    }
    return { id: 1, nombre: row.nombre };
  }
}
