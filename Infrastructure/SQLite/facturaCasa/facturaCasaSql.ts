export const facturaCasaSql = {
  insert:
    'INSERT INTO facturas_casa (anio, mes, valor_luz, valor_aseo) VALUES (?, ?, ?, ?)',
  selectById: 'SELECT * FROM facturas_casa WHERE id = ?',
  selectByAnioMes: 'SELECT * FROM facturas_casa WHERE anio = ? AND mes = ?',
  selectAllOrdered: 'SELECT * FROM facturas_casa ORDER BY anio DESC, mes DESC',
  update:
    'UPDATE facturas_casa SET anio = ?, mes = ?, valor_luz = ?, valor_aseo = ? WHERE id = ?',
} as const;
