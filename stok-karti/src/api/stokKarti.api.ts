import type { StokKarti } from '../types/stokKarti.types';

const BASE_URL = 'http://localhost:3001';

export async function getStokKartlari(): Promise<StokKarti[]> {
  const res = await fetch(`${BASE_URL}/stokKartlari`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

export async function deleteStokKarti(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/stokKartlari/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
}