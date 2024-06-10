export function formatCurrency(value: number): string {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}
