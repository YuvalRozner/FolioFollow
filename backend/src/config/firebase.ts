import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from './env';

const initialize = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (env.useFirebaseEmulators) {
    process.env.FIRESTORE_EMULATOR_HOST = env.firestoreEmulatorHost ?? process.env.FIRESTORE_EMULATOR_HOST;
    process.env.FIREBASE_AUTH_EMULATOR_HOST = env.firebaseAuthEmulatorHost ?? process.env.FIREBASE_AUTH_EMULATOR_HOST;
    return admin.initializeApp({
      projectId: env.firebaseProjectId,
      storageBucket: env.firebaseStorageBucket,
    });
  }

  if (env.firebaseServiceAccountKey) {
    const serviceAccount = JSON.parse(env.firebaseServiceAccountKey);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: env.firebaseProjectId,
      storageBucket: env.firebaseStorageBucket,
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: env.firebaseProjectId,
    storageBucket: env.firebaseStorageBucket,
  });
};

export const firebaseApp = initialize();
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export default admin;
