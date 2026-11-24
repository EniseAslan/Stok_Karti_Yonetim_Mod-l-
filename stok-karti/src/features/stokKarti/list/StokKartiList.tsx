import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteStokKarti, getStokKartlari } from '../../../api/stokKarti.api';
import Notification from '../../../components/Notification';
import {
  BIRIM_LABEL,
  DURUM_LABEL,
  DURUM_OPTIONS,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  type Durum,
  type Kategori,
  type StokKarti,
} from '../../../types/stokKarti.types';
import styles from './StokKartiList.module.scss';

type KategoriFilter = Kategori | 'ALL';
type DurumFilter = Durum | 'ALL';

function StokKartiList() {
  const [items, setItems] = useState<StokKarti[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [kategoriFilter, setKategoriFilter] = useState<KategoriFilter>('ALL');
  const [durumFilter, setDurumFilter] = useState<DurumFilter>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStokKartlari();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const q = search.toLocaleLowerCase('tr-TR');

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.ad.toLocaleLowerCase('tr-TR').includes(q) ||
      item.kod.toLocaleLowerCase('tr-TR').includes(q);
    const matchesKategori =
      kategoriFilter === 'ALL' || item.kategori === kategoriFilter;
    const matchesDurum = durumFilter === 'ALL' || item.durum === durumFilter;
    return matchesSearch && matchesKategori && matchesDurum;
  });

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Bu kaydı silmek istediğinize emin misiniz?');
    if (!ok) return;

    try {
      await deleteStokKarti(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setNotification('Kayıt silindi');
      setTimeout(() => setNotification(null), 3000);
    } catch {
      window.alert('Silme işlemi başarısız oldu.');
    }
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Stok Kartları</h1>

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div>
        <Link to="/stok-karti/yeni">Yeni</Link>

        <input
          type="text"
          placeholder="Ad veya kod ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value as KategoriFilter)}
        >
          <option value="ALL">Tüm kategoriler</option>
          {KATEGORI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={durumFilter}
          onChange={(e) => setDurumFilter(e.target.value as DurumFilter)}
        >
          <option value="ALL">Tüm durumlar</option>
          {DURUM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Kod</th>
            <th>Ad</th>
            <th>Kategori</th>
            <th>Birim</th>
            <th>Stok Miktarı</th>
            <th>Birim Fiyat</th>
            <th>Durum</th>
            <th>Depo</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={9}>Kayıt bulunamadı.</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.kod}</td>
                <td>{item.ad}</td>
                <td>{KATEGORI_LABEL[item.kategori]}</td>
                <td>{BIRIM_LABEL[item.birim]}</td>
                <td>{item.stokMiktari.toLocaleString('tr-TR')}</td>
                <td>
                  {item.birimFiyat.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  })}
                </td>
                <td>{DURUM_LABEL[item.durum]}</td>
                <td>{item.depoAdi}</td>
                <td>
                  <Link to={`/stok-karti/${item.id}`}>Düzenle</Link>
                  <button onClick={() => handleDelete(item.id)}>Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StokKartiList;