import { GetAdminUseCase, UpsertAdminUseCase } from '../../Application/UseCases/AdminUseCases';
import { InitializeLocalStorageUseCase } from '../../Application/UseCases/InitializeLocalStorageUseCase';
import {
  CreateFacturaCasaUseCase,
  GetFacturaCasaByIdUseCase,
  GetFacturasCasaUseCase,
  UpdateFacturaCasaUseCase,
} from '../../Application/UseCases/FacturaCasaUseCases';
import {
  CreateUsuarioUseCase,
  DeleteUsuarioUseCase,
  GetUsuarioByIdUseCase,
  GetUsuariosUseCase,
  UpdateUsuarioUseCase,
} from '../../Application/UseCases/UsuarioCrudUseCases';
import {
  CreateValorUsuarioUseCase,
  DeleteValorUsuarioUseCase,
  GetValorUsuarioByFacturaUsuarioUseCase,
  GetValorUsuarioByIdUseCase,
  GetValoresUsuarioByFacturaUseCase,
  UpdateValorUsuarioUseCase,
} from '../../Application/UseCases/ValorUsuarioUseCases';
import type { IDatabaseInitializer } from '../../Domain/Ports/IDatabaseInitializer';
import type { IAdminRepository } from '../../Domain/Ports/IAdminRepository';
import type { IFacturaCasaRepository } from '../../Domain/Ports/IFacturaCasaRepository';
import type { IUsuarioRepository } from '../../Domain/Ports/IUsuarioRepository';
import type { IValorUsuarioRepository } from '../../Domain/Ports/IValorUsuarioRepository';
import { AdminRepositorySqlite } from '../SQLite/admin/AdminRepositorySqlite';
import { FacturaCasaRepositorySqlite } from '../SQLite/facturaCasa/FacturaCasaRepositorySqlite';
import { SQLiteDatabaseInitializer } from '../SQLite/SQLiteDatabaseInitializer';
import { UsuarioRepositorySqlite } from '../SQLite/usuario/UsuarioRepositorySqlite';
import { ValorUsuarioRepositorySqlite } from '../SQLite/valorUsuario/ValorUsuarioRepositorySqlite';

export type MobileContainer = {
  initializeLocalStorageUseCase: InitializeLocalStorageUseCase;
  getAdminUseCase: GetAdminUseCase;
  upsertAdminUseCase: UpsertAdminUseCase;
  createUsuarioUseCase: CreateUsuarioUseCase;
  getUsuariosUseCase: GetUsuariosUseCase;
  getUsuarioByIdUseCase: GetUsuarioByIdUseCase;
  updateUsuarioUseCase: UpdateUsuarioUseCase;
  deleteUsuarioUseCase: DeleteUsuarioUseCase;
  createFacturaCasaUseCase: CreateFacturaCasaUseCase;
  getFacturasCasaUseCase: GetFacturasCasaUseCase;
  getFacturaCasaByIdUseCase: GetFacturaCasaByIdUseCase;
  updateFacturaCasaUseCase: UpdateFacturaCasaUseCase;
  createValorUsuarioUseCase: CreateValorUsuarioUseCase;
  getValoresUsuarioByFacturaUseCase: GetValoresUsuarioByFacturaUseCase;
  getValorUsuarioByFacturaUsuarioUseCase: GetValorUsuarioByFacturaUsuarioUseCase;
  getValorUsuarioByIdUseCase: GetValorUsuarioByIdUseCase;
  updateValorUsuarioUseCase: UpdateValorUsuarioUseCase;
  deleteValorUsuarioUseCase: DeleteValorUsuarioUseCase;
};

export function createMobileContainer(): MobileContainer {
  const databaseInitializer: IDatabaseInitializer = new SQLiteDatabaseInitializer();
  const usuarioRepository: IUsuarioRepository = new UsuarioRepositorySqlite();
  const facturaCasaRepository: IFacturaCasaRepository = new FacturaCasaRepositorySqlite();
  const valorUsuarioRepository: IValorUsuarioRepository = new ValorUsuarioRepositorySqlite();
  const adminRepository: IAdminRepository = new AdminRepositorySqlite();

  return {
    initializeLocalStorageUseCase: new InitializeLocalStorageUseCase(
      databaseInitializer,
    ),
    getAdminUseCase: new GetAdminUseCase(adminRepository),
    upsertAdminUseCase: new UpsertAdminUseCase(adminRepository),
    createUsuarioUseCase: new CreateUsuarioUseCase(usuarioRepository),
    getUsuariosUseCase: new GetUsuariosUseCase(usuarioRepository),
    getUsuarioByIdUseCase: new GetUsuarioByIdUseCase(usuarioRepository),
    updateUsuarioUseCase: new UpdateUsuarioUseCase(usuarioRepository),
    deleteUsuarioUseCase: new DeleteUsuarioUseCase(usuarioRepository),
    createFacturaCasaUseCase: new CreateFacturaCasaUseCase(facturaCasaRepository),
    getFacturasCasaUseCase: new GetFacturasCasaUseCase(facturaCasaRepository),
    getFacturaCasaByIdUseCase: new GetFacturaCasaByIdUseCase(facturaCasaRepository),
    updateFacturaCasaUseCase: new UpdateFacturaCasaUseCase(facturaCasaRepository),
    createValorUsuarioUseCase: new CreateValorUsuarioUseCase(
      valorUsuarioRepository,
      usuarioRepository,
      facturaCasaRepository,
    ),
    getValoresUsuarioByFacturaUseCase: new GetValoresUsuarioByFacturaUseCase(valorUsuarioRepository),
    getValorUsuarioByFacturaUsuarioUseCase: new GetValorUsuarioByFacturaUsuarioUseCase(
      valorUsuarioRepository,
    ),
    getValorUsuarioByIdUseCase: new GetValorUsuarioByIdUseCase(valorUsuarioRepository),
    updateValorUsuarioUseCase: new UpdateValorUsuarioUseCase(
      valorUsuarioRepository,
      usuarioRepository,
      facturaCasaRepository,
    ),
    deleteValorUsuarioUseCase: new DeleteValorUsuarioUseCase(valorUsuarioRepository),
  };
}
