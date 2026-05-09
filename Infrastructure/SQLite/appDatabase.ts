import { Directory, Paths } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const STORAGE_FOLDER_NAME = 'AppCasa';
const DATABASE_FILE_NAME = 'casa.db';

let cached: SQLite.SQLiteDatabase | null = null;

/**
 * Conexión SQLite compartida (una sola instancia por proceso).
 */
export async function getAppDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (Platform.OS === 'web') {
    throw new Error('Base de datos local no disponible en web.');
  }
  if (cached) {
    return cached;
  }
  const appDir = new Directory(Paths.document, STORAGE_FOLDER_NAME);
  if (!appDir.exists) {
    appDir.create({ intermediates: true });
  }
  cached = await SQLite.openDatabaseAsync(DATABASE_FILE_NAME, undefined, appDir.uri);
  return cached;
}
