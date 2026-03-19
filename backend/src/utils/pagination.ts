import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@shared/constants';

export const getPagination = (page?: number, limit?: number) => {
  const normalizedPage = Math.max(1, Number(page) || 1);
  const normalizedLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(limit) || DEFAULT_PAGE_SIZE));
  const offset = (normalizedPage - 1) * normalizedLimit;

  return { page: normalizedPage, limit: normalizedLimit, offset };
};
