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
  Durum,
  Kategori,
  type Depo,
  type StokKarti,
  type StokKartiForm,
} from '../../../types/stokKarti.types';
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
    () => formik.values.stokMiktari * formik.values.birimFiyat,
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

  const wrap = (body: ReactNode) =>
    isInModal ? (
      <div className={styles.overlay}>
        <div
          className={`${styles.dialog} ${styles.dialogLarge}`}
          role="dialog"
          aria-modal="true"
        >
          {body}
        </div>
      </div>
    ) : (
      <div>{body}</div>
    );

  const title = isNew ? 'Yeni Stok Kartı' : `Stok Kartı #${recordId}`;

  if (loading) return wrap(<p>Yükleniyor…</p>);

  if (error) {
    return wrap(
      <>
        <p>Hata: {error}</p>
        {isInModal ? (
          <button type="button" onClick={onClose}>
            Kapat
          </button>
        ) : (
          <Link to="/stok-karti">← Listeye dön</Link>
        )}
      </>,
    );
  }

  return wrap(
    <>
      {isInModal ? (
        <h2>{title}</h2>
      ) : (
        <>
          <Link to="/stok-karti">← Listeye dön</Link>
          <h1>{title}</h1>
        </>
      )}

      <form onSubmit={formik.handleSubmit}>
        <GenelBilgiler formik={formik} stokDegeri={stokDegeri} />

        <section>
          <h2>Depo Bilgileri</h2>
          <p>
            Depo: <strong>{formik.values.depoAdi || 'Seçilmedi'}</strong>
          </p>
          <button type="button" onClick={() => setDepoModalOpen(true)}>
            Depo Seç
          </button>
        </section>

        <button type="submit" disabled={formik.isSubmitting}>
          Kaydet
        </button>
        {isInModal ? (
          <button type="button" onClick={onClose}>
            İptal
          </button>
        ) : (
          <Link to="/stok-karti">İptal</Link>
        )}
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