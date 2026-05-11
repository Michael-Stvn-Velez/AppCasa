export const valorUsuarioSql = {
  insert:
    'INSERT INTO valores_usuario (id_factura_casa, id_usuario, consumo_luz, valor_aseo) VALUES (?, ?, ?, ?)',
  selectById: 'SELECT * FROM valores_usuario WHERE id = ?',
  selectByFacturaUsuario:
    'SELECT * FROM valores_usuario WHERE id_factura_casa = ? AND id_usuario = ?',
  selectAllByFactura: 'SELECT * FROM valores_usuario WHERE id_factura_casa = ? ORDER BY id ASC',
  update:
    'UPDATE valores_usuario SET id_factura_casa = ?, id_usuario = ?, consumo_luz = ?, valor_aseo = ? WHERE id = ?',
  deleteById: 'DELETE FROM valores_usuario WHERE id = ?',
} as const;
