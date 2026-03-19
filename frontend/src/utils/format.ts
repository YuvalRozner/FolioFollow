/**
 * Formatting utilities for currency, numbers, and dates
 */

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number, currency: 'ILS' | 'USD' = 'ILS', decimals: number = 2): string {
  const symbol = currency === 'ILS' ? '₪' : '$';
  const absFormatted = formatNumber(Math.abs(value), decimals);
  const prefix = value < 0 ? '-' : '';
  return `${prefix}${symbol}${absFormatted}`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return formatNumber(value, 0);
}

export function getPnlColor(value: number): string {
  if (value > 0) return '#2ea043';
  if (value < 0) return '#f85149';
  return '#8b949e';
}

export function getPnlArrow(value: number): string {
  if (value > 0) return '▲';
  if (value < 0) return '▼';
  return '–';
}
