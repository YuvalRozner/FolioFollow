export const nowIso = (): string => new Date().toISOString();
export const normalizeDate = (value: string): string => new Date(value).toISOString().slice(0, 10);
