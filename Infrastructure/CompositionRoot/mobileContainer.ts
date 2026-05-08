import { InitializeLocalStorageUseCase } from '../../Application/UseCases/InitializeLocalStorageUseCase';
import type { IDatabaseInitializer } from '../../Domain/Ports/IDatabaseInitializer';
import { SQLiteDatabaseInitializer } from '../SQLite/SQLiteDatabaseInitializer';

export type MobileContainer = {
  initializeLocalStorageUseCase: InitializeLocalStorageUseCase;
};

export function createMobileContainer(): MobileContainer {
  const databaseInitializer: IDatabaseInitializer = new SQLiteDatabaseInitializer();
  const initializeLocalStorageUseCase = new InitializeLocalStorageUseCase(
    databaseInitializer,
  );

  return {
    initializeLocalStorageUseCase,
  };
}
