/** Consultas SQL del agregado Usuario (DML y textos reutilizables). */
export const usuarioSql = {
  insert:
    'INSERT INTO usuarios (nombre, piso_de_la_casa, es_casa, activo) VALUES (?, ?, ?, ?)',
  selectById: 'SELECT * FROM usuarios WHERE id = ?',
  selectAllOrdered: 'SELECT * FROM usuarios ORDER BY id ASC',
  update:
    'UPDATE usuarios SET nombre = ?, piso_de_la_casa = ?, es_casa = ?, activo = ? WHERE id = ?',
  deleteById: 'DELETE FROM usuarios WHERE id = ?',
} as const;
