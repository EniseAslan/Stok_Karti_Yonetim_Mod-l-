const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
});
const numberFormatter = new Intl.NumberFormat('tr-TR');

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function hesaplaStokDegeri(
  stokMiktari: number,
  birimFiyat: number,
): number {
  return stokMiktari * birimFiyat;
}