import type { SQLiteDatabase } from 'expo-sqlite';

const ADMIN_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS admin_singleton (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  nombre TEXT NOT NULL
);
`;

export async function ensureAdminTableSchema(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(ADMIN_TABLE_DDL);
}
