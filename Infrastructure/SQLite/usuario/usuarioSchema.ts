import type { SQLiteDatabase } from 'expo-sqlite';

/** Definición de la tabla `usuarios` (solo DDL). Las operaciones DML viven en `usuarioSql`. */
const USUARIO_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nombre TEXT NOT NULL,
  piso_de_la_casa TEXT NOT NULL,
  es_casa INTEGER NOT NULL,
  activo INTEGER NOT NULL DEFAULT 1
);
`;

export async function ensureUsuarioTableSchema(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(USUARIO_TABLE_DDL);
  const columns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(usuarios)');
  const hasActivo = columns.some((c) => c.name === 'activo');
  if (!hasActivo) {
    await database.execAsync(
      'ALTER TABLE usuarios ADD COLUMN activo INTEGER NOT NULL DEFAULT 1',
    );
  }
}
