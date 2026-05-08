import type { IDatabaseInitializer } from '../../Domain/Ports/IDatabaseInitializer';
import { Directory, Paths } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

/** Subcarpeta lógica bajo el directorio que el SO asigna a la app (no es una ruta absoluta). */
const STORAGE_FOLDER_NAME = 'AppCasa';
/** Nombre del fichero SQLite dentro de esa subcarpeta. */
const DATABASE_FILE_NAME = 'casa.db';

/**
 * Implementación del puerto con módulos Expo (equivalente a capa de datos local).
 * La ruta base la resuelve el runtime: `Paths.document` apunta al sandbox de documentos
 * correcto en Android, iOS, etc. La app solo concatena nombres relativos (`AppCasa/casa.db`).
 */
export class SQLiteDatabaseInitializer implements IDatabaseInitializer {
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    // Origen del path: lo entrega el SO/Cada dispositivo en tiempo de ejecución (no hay que hardcodear rutas por marca o modelo).
    const appDir = new Directory(Paths.document, STORAGE_FOLDER_NAME);
    if (!appDir.exists) {
      appDir.create({ intermediates: true });
    }

    const db = await SQLite.openDatabaseAsync(
      DATABASE_FILE_NAME,
      undefined,
      appDir.uri,
    );

    await db.execAsync('PRAGMA user_version;');
    await db.closeAsync();
  }
}
