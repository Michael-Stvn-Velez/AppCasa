export const adminSql = {
  selectById1: 'SELECT id, nombre FROM admin_singleton WHERE id = 1',
  upsert:
    'INSERT INTO admin_singleton (id, nombre) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET nombre = excluded.nombre',
} as const;
