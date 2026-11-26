import { useEffect, useState } from 'react';
import { getDepolar } from '../../../api/stokKarti.api';
import type { Depo } from '../../../types/stokKarti.types';
import styles from '../card/StokKartiCard.module.scss';

interface DepoModalProps {
  onSelect: (depo: Depo) => void;
  onClose: () => void;
}

function DepoModal({ onSelect, onClose }: DepoModalProps) {
  const [depolar, setDepolar] = useState<Depo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDepolar();
        setDepolar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="depo-modal-title"
      >
        <h2 id="depo-modal-title" className={styles.dialogTitle}>
          Depo Seç
        </h2>

        {loading && <p>Yükleniyor…</p>}
        {error && <p>Hata: {error}</p>}

        {!loading && !error && (
          <ul className={styles.depoList}>
            {depolar.map((depo) => (
              <li key={depo.id}>
                <button
                  type="button"
                  className={styles.depoItem}
                  onClick={() => onSelect(depo)}
                >
                  {depo.adi}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepoModal;