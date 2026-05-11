import type { SQLiteDatabase } from 'expo-sqlite';

const VALOR_USUARIO_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS valores_usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  id_factura_casa INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  consumo_luz REAL NOT NULL,
  valor_aseo REAL,
  UNIQUE (id_factura_casa, id_usuario),
  FOREIGN KEY (id_factura_casa) REFERENCES facturas_casa (id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
`;

export async function ensureValorUsuarioTableSchema(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(VALOR_USUARIO_TABLE_DDL);
}
