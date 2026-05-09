import type { Admin } from '../../Domain/Entities/Admin';
import type { IAdminRepository } from '../../Domain/Ports/IAdminRepository';

export class GetAdminUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  execute(): Promise<Admin | null> {
    return this.adminRepository.getSingleton();
  }
}

export class UpsertAdminUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  execute(nombre: string): Promise<Admin> {
    return this.adminRepository.upsertNombre(nombre.trim());
  }
}
