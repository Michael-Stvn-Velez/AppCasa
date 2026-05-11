import type { IDatabaseInitializer } from '../../Domain/Ports/IDatabaseInitializer';
import { Platform } from 'react-native';
import { ensureAdminTableSchema } from './admin/adminSchema';
import { getAppDatabase } from './appDatabase';
import { ensureFacturaCasaTableSchema } from './facturaCasa/facturaCasaSchema';
import { ensureUsuarioTableSchema } from './usuario/usuarioSchema';

/**
 * Abre la BD compartida y deja el esquema mínimo aplicado. No cierra la conexión.
 * El DDL de cada módulo vive en su propio archivo (p. ej. `usuario/usuarioSchema.ts`).
 */
export class SQLiteDatabaseInitializer implements IDatabaseInitializer {
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    const database = await getAppDatabase();
    await database.execAsync('PRAGMA user_version;');
    await ensureUsuarioTableSchema(database);
    await ensureFacturaCasaTableSchema(database);
    await ensureAdminTableSchema(database);
  }
}
