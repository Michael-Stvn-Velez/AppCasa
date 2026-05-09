import type { Admin } from '../Entities/Admin';

export interface IAdminRepository {
  getSingleton(): Promise<Admin | null>;
  upsertNombre(nombre: string): Promise<Admin>;
}
