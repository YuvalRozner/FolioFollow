import { badRequest } from './errors';

export const nowIso = (): string => new Date().toISOString();
export const normalizeDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw badRequest('Invalid date');
  }
  return date.toISOString().slice(0, 10);
};
