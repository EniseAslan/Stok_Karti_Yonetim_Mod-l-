import type { StokKarti,StokKartiForm } from '../types/stokKarti.types';

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

export async function getStokKarti(id: number): Promise<StokKarti> {
  const res = await fetch(`${BASE_URL}/stokKartlari/${id}`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

export async function createStokKarti(data: StokKartiForm): Promise<StokKarti> {
  const res = await fetch(`${BASE_URL}/stokKartlari`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

export async function updateStokKarti(
  id: number,
  data: StokKartiForm,
): Promise<StokKarti> {
  const res = await fetch(`${BASE_URL}/stokKartlari/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}