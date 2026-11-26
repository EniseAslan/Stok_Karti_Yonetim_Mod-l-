
export enum Kategori {
  Hammadde = 'HAMMADDE',
  YariMamul = 'YARI_MAMUL',
  Mamul = 'MAMUL',
  Ticari = 'TICARI',
}

export const KATEGORI_LABEL: Record<Kategori, string> = {
  [Kategori.Hammadde]: 'Hammadde',
  [Kategori.YariMamul]: 'Yarı Mamul',
  [Kategori.Mamul]: 'Mamul',
  [Kategori.Ticari]: 'Ticari Mal',
};

export const KATEGORI_OPTIONS = Object.values(Kategori).map((value) => ({
  value,
  label: KATEGORI_LABEL[value],
}));

export enum Birim {
  Adet = 'ADET',
  Kg = 'KG',
  Litre = 'LITRE',
  Metre = 'METRE',
}

export const BIRIM_LABEL: Record<Birim, string> = {
  [Birim.Adet]: 'Adet',
  [Birim.Kg]: 'Kg',
  [Birim.Litre]: 'Litre',
  [Birim.Metre]: 'Metre',
};

export const BIRIM_OPTIONS = Object.values(Birim).map((value) => ({
  value,
  label: BIRIM_LABEL[value],
}));

export enum Durum {
  Aktif = 'AKTIF',
  Pasif = 'PASIF',
}

export const DURUM_LABEL: Record<Durum, string> = {
  [Durum.Aktif]: 'Aktif',
  [Durum.Pasif]: 'Pasif',
};

export const DURUM_OPTIONS = Object.values(Durum).map((value) => ({
  value,
  label: DURUM_LABEL[value],
}));

export interface StokKarti {
  id: number;
  ad: string;
  kod: string;
  kategori: Kategori;
  birim: Birim;
  stokMiktari: number;
  birimFiyat: number;
  durum: Durum;
  depoId: number;
  depoAdi: string;
}

export type StokKartiForm = Omit<StokKarti, 'id'>;

export interface Depo {
  id: number;
  adi: string;
}

