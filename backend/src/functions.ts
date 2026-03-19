import { onRequest } from 'firebase-functions/v2/https';
import { app } from './app';

export const api = onRequest(
  {
    region: 'europe-west1',
    cors: true,
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  app,
);
