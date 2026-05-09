import type { SQLiteDatabase } from 'expo-sqlite';

/** Definición de la tabla `usuarios` (solo DDL). Las operaciones DML viven en `usuarioSql`. */
const USUARIO_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  nombre TEXT NOT NULL,
  piso_de_la_casa TEXT NOT NULL,
  es_casa INTEGER NOT NULL
);
`;

export async function ensureUsuarioTableSchema(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(USUARIO_TABLE_DDL);
}
