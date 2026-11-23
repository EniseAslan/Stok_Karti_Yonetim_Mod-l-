import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStokKartlari } from '../../../api/stokKarti.api';
import {
  BIRIM_LABEL,
  DURUM_LABEL,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  type StokKarti,
} from '../../../types/stokKarti.types';
import styles from './StokKartiList.module.scss';

function StokKartiList() {
  const [items, setItems] = useState<StokKarti[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
 <div>
      <h1 className={styles.title}>Stok Kartları</h1>
      <Link to="/stok-karti/yeni">Yeni</Link>
      <select>
        {KATEGORI_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/stok-karti/${item.id}`}>{item.ad}</Link>
            {' — '}
            {KATEGORI_LABEL[item.kategori]} · {BIRIM_LABEL[item.birim]} ·{' '}
            {DURUM_LABEL[item.durum]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StokKartiList;