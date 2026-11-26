import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  createStokKarti,
  getStokKarti,
  updateStokKarti,
} from '../../../api/stokKarti.api';
import {
  Birim,
  DURUM_LABEL,
  Durum,
  Kategori,
  type Depo,
  type StokKarti,
  type StokKartiForm,
} from '../../../types/stokKarti.types';
import { hesaplaStokDegeri } from '../../../utils/project/stokKarti';
import DepoModal from '../modal/DepoModal';
import GenelBilgiler from './GenelBilgiler';
import styles from './StokKartiCard.module.scss';

const validationSchema = Yup.object({
  ad: Yup.string().trim().required('Ad zorunludur'),
  stokMiktari: Yup.number()
    .typeError('Stok miktarı bir sayı olmalıdır')
    .min(0, 'Stok miktarı 0 veya daha büyük olmalıdır')
    .required('Stok miktarı zorunludur'),
  birimFiyat: Yup.number()
    .typeError('Birim fiyat bir sayı olmalıdır')
    .min(0, 'Birim fiyat 0 veya daha büyük olmalıdır')
    .required('Birim fiyat zorunludur'),
});

const EMPTY_FORM: StokKartiForm = {
  ad: '',
  kod: '',
  kategori: Kategori.Hammadde,
  birim: Birim.Adet,
  stokMiktari: 0,
  birimFiyat: 0,
  durum: Durum.Aktif,
  depoId: 0,
  depoAdi: '',
};

interface StokKartiCardProps {
  isInModal?: boolean;
  stokId?: number;
  onSaved?: (saved: StokKarti) => void;
  onClose?: () => void;
}

function StokKartiCard({
  isInModal = false,
  stokId,
  onSaved,
  onClose,
}: StokKartiCardProps) {
  const params = useParams();
  const navigate = useNavigate();


  const routeId = params.id !== undefined ? Number(params.id) : undefined;
  const recordId = isInModal ? stokId : routeId;
  const isNew = recordId === undefined;

  const [loading, setLoading] = useState<boolean>(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [depoModalOpen, setDepoModalOpen] = useState<boolean>(false);

  const formik = useFormik<StokKartiForm>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const saved =
          recordId === undefined
            ? await createStokKarti(values)
            : await updateStokKarti(recordId, values);

        if (isInModal) {
          onSaved?.(saved);
        } else {
          navigate('/stok-karti');
        }
      } catch {
        window.alert('Kayıt başarısız oldu.');
      }
    },
  });

  const { setValues } = formik;


  useEffect(() => {
    if (recordId === undefined) return;

    const load = async () => {
      try {
        const data = await getStokKarti(recordId);
        setValues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [recordId, setValues]);

  
  const stokDegeri = useMemo(
    () =>
      hesaplaStokDegeri(formik.values.stokMiktari, formik.values.birimFiyat),
    [formik.values.stokMiktari, formik.values.birimFiyat],
  );


  const handleDepoSelect = (depo: Depo) => {
    formik.setValues({
      ...formik.values,
      depoId: depo.id,
      depoAdi: depo.adi,
    });
    setDepoModalOpen(false);
  };

  const title = isNew ? 'Yeni Stok Kartı' : `Stok Kartı #${recordId}`;

 
  const wrap = (body: ReactNode) =>
    isInModal ? (
      <div className={styles.overlay}>
        <div
          className={styles.cardDialog}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {body}
        </div>
      </div>
    ) : (
      <div className={styles.pageRoot}>{body}</div>
    );

  if (loading) return wrap(<p className={styles.message}>Yükleniyor…</p>);

  if (error) {
    return wrap(
      <div className={styles.message}>
        <p>Hata: {error}</p>
        {isInModal ? (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Kapat
          </button>
        ) : (
          <Link to="/stok-karti" className={styles.secondaryButton}>
            ← Listeye dön
          </Link>
        )}
      </div>,
    );
  }

  return wrap(
    <>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          {!isInModal && (
            <Link
              to="/stok-karti"
              className={styles.back}
              aria-label="Listeye dön"
            >
              ←
            </Link>
          )}
          <h1 className={styles.headerTitle}>{title}</h1>
        </div>

        <div className={styles.headerSide}>
          <span
            className={`${styles.pill} ${
              formik.values.durum === Durum.Aktif
                ? styles.pillActive
                : styles.pillPassive
            }`}
          >
            {DURUM_LABEL[formik.values.durum]}
          </span>
          {isInModal && (
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Kapat"
              onClick={onClose}
            >
              ×
            </button>
          )}
        </div>
      </header>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.body}>
          <GenelBilgiler formik={formik} stokDegeri={stokDegeri} />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Depo Bilgileri</h2>
            <div className={styles.depoRow}>
              <span className={styles.depoValue}>
                {formik.values.depoAdi || 'Depo seçilmedi'}
              </span>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setDepoModalOpen(true)}
              >
                Depo Seç
              </button>
            </div>
          </section>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={formik.isSubmitting}
          >
            Kaydet
          </button>
          {isInModal ? (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Vazgeç
            </button>
          ) : (
            <Link to="/stok-karti" className={styles.secondaryButton}>
              Vazgeç
            </Link>
          )}
        </div>
      </form>

      {depoModalOpen && (
        <DepoModal
          onSelect={handleDepoSelect}
          onClose={() => setDepoModalOpen(false)}
        />
      )}
    </>,
  );
}

export default StokKartiCard;