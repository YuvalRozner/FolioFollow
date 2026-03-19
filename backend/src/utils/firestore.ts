import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

const convertValue = (value: unknown): unknown => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(convertValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, convertValue(v)]));
  }

  return value;
};

export const docToData = <T>(snapshot: QueryDocumentSnapshot<DocumentData>): T => {
  const data = convertValue(snapshot.data());
  return { ...(data as Record<string, unknown>), id: snapshot.id } as T;
};
