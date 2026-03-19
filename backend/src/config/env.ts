import dotenv from 'dotenv';

dotenv.config();

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const requiredCorsOrigin = (): string => {
  const fallback = 'https://foliofollow.web.app,https://foliofollow.firebaseapp.com,http://localhost:5173';
  return required('CORS_ORIGIN', fallback);
};

const bool = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  return ['1', 'true', 'yes'].includes(value.toLowerCase());
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  corsOrigin: requiredCorsOrigin(),
  firebaseProjectId: required('FIREBASE_PROJECT_ID', 'foliofollow'),
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  firebaseServiceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  useFirebaseEmulators: bool(process.env.USE_FIREBASE_EMULATORS, false),
  firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
  firebaseAuthEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
};
