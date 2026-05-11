import type { SQLiteDatabase } from 'expo-sqlite';

const FACTURA_CASA_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS facturas_casa (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  anio INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  valor_luz REAL NOT NULL,
  valor_aseo REAL NOT NULL,
  UNIQUE (anio, mes)
);
`;

export async function ensureFacturaCasaTableSchema(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(FACTURA_CASA_TABLE_DDL);
}
