export const formatUSD = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const formatCOP = (amount: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

export const formatCurrency = (amount: number, currency: 'USD' | 'COP') =>
  currency === 'USD' ? formatUSD(amount) : formatCOP(amount);

export const usdToCop = (usd: number, rate: number) => usd * rate;
export const copToUsd = (cop: number, rate: number) => cop / rate;
