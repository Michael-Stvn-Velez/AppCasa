export type RootStackParamList = {
  WebDbUnavailable: undefined;
  Bootstrap: undefined;
  AdminWelcome: undefined;
  AdminEdit: undefined;
  Home: undefined;
  UsuarioList: undefined;
  UsuarioForm: { usuarioId?: number };
  FacturaCasaMenu: undefined;
  FacturaCasaHistorico: undefined;
  FacturaCasaForm: { facturaId?: number };
  ValorUsuariosFactura: { facturaId: number };
  ValorUsuarioForm: { facturaId: number; usuarioId: number };
};
