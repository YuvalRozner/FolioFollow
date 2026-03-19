export const round = (value: number, precision = 2): number => {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const safeDivide = (numerator: number, denominator: number): number => {
  if (!denominator) return 0;
  return numerator / denominator;
};

export const sum = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);
