import { InitializeLocalStorageUseCase } from '../../Application/UseCases/InitializeLocalStorageUseCase';
import {
  CreateUsuarioUseCase,
  DeleteUsuarioUseCase,
  GetUsuarioByIdUseCase,
  GetUsuariosUseCase,
  UpdateUsuarioUseCase,
} from '../../Application/UseCases/UsuarioCrudUseCases';
import type { IDatabaseInitializer } from '../../Domain/Ports/IDatabaseInitializer';
import type { IUsuarioRepository } from '../../Domain/Ports/IUsuarioRepository';
import { SQLiteDatabaseInitializer } from '../SQLite/SQLiteDatabaseInitializer';
import { UsuarioRepositorySqlite } from '../SQLite/usuario/UsuarioRepositorySqlite';

export type MobileContainer = {
  initializeLocalStorageUseCase: InitializeLocalStorageUseCase;
  createUsuarioUseCase: CreateUsuarioUseCase;
  getUsuariosUseCase: GetUsuariosUseCase;
  getUsuarioByIdUseCase: GetUsuarioByIdUseCase;
  updateUsuarioUseCase: UpdateUsuarioUseCase;
  deleteUsuarioUseCase: DeleteUsuarioUseCase;
};

export function createMobileContainer(): MobileContainer {
  const databaseInitializer: IDatabaseInitializer = new SQLiteDatabaseInitializer();
  const usuarioRepository: IUsuarioRepository = new UsuarioRepositorySqlite();

  return {
    initializeLocalStorageUseCase: new InitializeLocalStorageUseCase(
      databaseInitializer,
    ),
    createUsuarioUseCase: new CreateUsuarioUseCase(usuarioRepository),
    getUsuariosUseCase: new GetUsuariosUseCase(usuarioRepository),
    getUsuarioByIdUseCase: new GetUsuarioByIdUseCase(usuarioRepository),
    updateUsuarioUseCase: new UpdateUsuarioUseCase(usuarioRepository),
    deleteUsuarioUseCase: new DeleteUsuarioUseCase(usuarioRepository),
  };
}
