/**
 * Puerto: prepara almacenamiento local (directorio + base SQLite).
 * Sin dependencias de frameworks ni librerías de infraestructura.
 */
export interface IDatabaseInitializer {
  initialize(): Promise<void>;
}
