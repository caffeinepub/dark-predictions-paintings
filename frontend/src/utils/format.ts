export function formatPrice(price: bigint): string {
  const dollars = Number(price) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}
