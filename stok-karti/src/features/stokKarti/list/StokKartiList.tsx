import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteStokKarti, getStokKartlari } from '../../../api/stokKarti.api';
import Notification from '../../../components/Notification';
import {
  BIRIM_LABEL,
  DURUM_LABEL,
  DURUM_OPTIONS,
  Durum,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  type Kategori,
  type StokKarti,
} from '../../../types/stokKarti.types';
import {
  formatCurrency,
  formatNumber,
  hesaplaStokDegeri,
} from '../../../utils/_project/stokKarti';
import StokKartiCard from '../card/StokKartiCard';
import styles from './StokKartiList.module.scss';

type KategoriFilter = Kategori | 'ALL';
type DurumFilter = Durum | 'ALL';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}


interface LocationState {
  notification?: string;
}

function StokKartiList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState<StokKarti[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [search, setSearch] = useState<string>('');
  const [kategoriFilter, setKategoriFilter] = useState<KategoriFilter>('ALL');
  const [durumFilter, setDurumFilter] = useState<DurumFilter>('ALL');
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [quickEditId, setQuickEditId] = useState<number | null>(null);

 useEffect(() => {
  const load = async () => {
    try {
      const data = await getStokKartlari();
      const valid = data.filter(
        (i) => i && typeof i.ad === 'string' && typeof i.kod === 'string',
      );
      setItems(valid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };
  load();
}, [reloadKey]);

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (!state?.notification) return;

    setNotification({ message: state.notification, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

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

  const activeCount = filtered.filter((i) => i.durum === Durum.Aktif).length;
  const totalValue = filtered.reduce(
    (sum, i) => sum + hesaplaStokDegeri(i.stokMiktari, i.birimFiyat),
    0,
  );

  const showNotification = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const clearFilters = () => {
    setSearch('');
    setKategoriFilter('ALL');
    setDurumFilter('ALL');
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Bu kaydı silmek istediğinize emin misiniz?');
    if (!ok) return;

    try {
      await deleteStokKarti(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      showNotification('Kayıt silindi');
    } catch {
      showNotification('Silme işlemi başarısız oldu.', 'error');
    }
  };

  const handleQuickSaved = (saved: StokKarti) => {
    setItems((prev) =>
      prev.map((item) => (item.id === saved.id ? saved : item)),
    );
    setQuickEditId(null);
    showNotification('Kayıt güncellendi');
  };

  if (loading) return <p className={styles.page}>Yükleniyor…</p>;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p className={styles.errorTitle}>Liste yüklenemedi</p>
          <p className={styles.muted}>Hata: {error}</p>
          <p className={styles.muted}>
            Sunucunun (npm run api) çalıştığından emin ol.
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={handleRetry}
          >
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  const hasFilter =
    search !== '' || kategoriFilter !== 'ALL' || durumFilter !== 'ALL';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Stok Kartları</h1>
          <p className={styles.subtitle}>{filtered.length} kayıt listeleniyor</p>
        </div>
        <Link to="/stok-karti/yeni" className={styles.newButton}>
          + Yeni Stok Kartı
        </Link>
      </header>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.errorTitle}>Henüz stok kartı yok</p>
          <p className={styles.muted}>
            İlk kaydını eklemek için aşağıdaki butonu kullan.
          </p>
          <Link to="/stok-karti/yeni" className={styles.newButton}>
            + İlk stok kartını ekle
          </Link>
        </div>
      ) : (
        <>
          <section className={styles.summary}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Listelenen kalem</span>
              <span className={styles.summaryValue}>{filtered.length}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Aktif kart</span>
              <span className={styles.summaryValue}>{activeCount}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Toplam stok değeri</span>
              <span className={styles.summaryValue}>
                {formatCurrency(totalValue)}
              </span>
            </div>
          </section>

          <div className={styles.toolbar}>
            <input
              type="text"
              className={styles.search}
              placeholder="Ad veya kod ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className={styles.select}
              value={kategoriFilter}
              onChange={(e) =>
                setKategoriFilter(e.target.value as KategoriFilter)
              }
            >
              <option value="ALL">Tüm kategoriler</option>
              {KATEGORI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
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

          <div className={styles.chips}>
            {search !== '' && (
              <span className={styles.chip}>
                Arama: {search}
                <button
                  type="button"
                  className={styles.chipClose}
                  aria-label="Aramayı temizle"
                  onClick={() => setSearch('')}
                >
                  ×
                </button>
              </span>
            )}
            {kategoriFilter !== 'ALL' && (
              <span className={styles.chip}>
                Kategori: {KATEGORI_LABEL[kategoriFilter]}
                <button
                  type="button"
                  className={styles.chipClose}
                  aria-label="Kategori filtresini temizle"
                  onClick={() => setKategoriFilter('ALL')}
                >
                  ×
                </button>
              </span>
            )}
            {durumFilter !== 'ALL' && (
              <span className={styles.chip}>
                Durum: {DURUM_LABEL[durumFilter]}
                <button
                  type="button"
                  className={styles.chipClose}
                  aria-label="Durum filtresini temizle"
                  onClick={() => setDurumFilter('ALL')}
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Ad</th>
                  <th>Kategori</th>
                  <th className={styles.numeric}>Stok</th>
                  <th className={styles.numeric}>Birim Fiyat</th>
                  <th>Durum</th>
                  <th>Depo</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.empty}>
                      Aramanıza uyan kayıt yok.
                      {hasFilter && (
                        <>
                          {' '}
                          <button
                            type="button"
                            className={styles.linkButton}
                            onClick={clearFilters}
                          >
                            Filtreleri temizle
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          to={`/stok-karti/${item.id}`}
                          className={styles.codeLink}
                        >
                          {item.kod}
                        </Link>
                      </td>
                      <td className={styles.name}>{item.ad}</td>
                      <td>{KATEGORI_LABEL[item.kategori]}</td>
                      <td className={styles.numeric}>
                        {formatNumber(item.stokMiktari)}{' '}
                        {BIRIM_LABEL[item.birim]}
                        {item.stokMiktari === 0 && (
                          <span
                            className={`${styles.badge} ${styles.badgeWarning} ${styles.stockNote}`}
                          >
                            Stok yok
                          </span>
                        )}
                      </td>
                      <td className={styles.numeric}>
                        {formatCurrency(item.birimFiyat)}
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            item.durum === Durum.Aktif
                              ? styles.badgeActive
                              : styles.badgePassive
                          }`}
                        >
                          {DURUM_LABEL[item.durum]}
                        </span>
                      </td>
                      <td className={styles.muted}>{item.depoAdi || '—'}</td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            to={`/stok-karti/${item.id}`}
                            className={styles.actionButton}
                          >
                            Düzenle
                          </Link>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => setQuickEditId(item.id)}
                          >
                            Hızlı
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.danger}`}
                            onClick={() => handleDelete(item.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {quickEditId !== null && (
        <StokKartiCard
          isInModal
          stokId={quickEditId}
          onSaved={handleQuickSaved}
          onClose={() => setQuickEditId(null)}
        />
      )}
    </div>
  );
}

export default StokKartiList;