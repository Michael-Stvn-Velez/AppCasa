import type { IDatabaseInitializer } from '../../Domain/Ports/IDatabaseInitializer';

export class InitializeLocalStorageUseCase {
  constructor(private readonly databaseInitializer: IDatabaseInitializer) {}

  async execute(): Promise<void> {
    await this.databaseInitializer.initialize();
  }
}
