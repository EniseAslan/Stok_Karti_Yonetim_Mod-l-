import { useEffect, useMemo, useState } from 'react';
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
  type StokKartiForm,
} from '../../../types/stokKarti.types';
import GenelBilgiler from './GenelBilgiler';

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

function StokKartiCard() {
  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!isNew);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<StokKartiForm>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await createStokKarti(values);
        } else {
          await updateStokKarti(Number(id), values);
        }
        navigate('/stok-karti');
      } catch {
        window.alert('Kayıt başarısız oldu.');
      }
    },
  });

  const { setValues } = formik;

  useEffect(() => {
    if (isNew) return;

    const load = async () => {
      try {
        const data = await getStokKarti(Number(id));
        setValues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew, setValues]);


  const stokDegeri = useMemo(
    () => formik.values.stokMiktari * formik.values.birimFiyat,
    [formik.values.stokMiktari, formik.values.birimFiyat],
  );

  if (loading) return <p>Yükleniyor…</p>;
  if (error) {
    return (
      <div>
        <p>Hata: {error}</p>
        <Link to="/stok-karti">← Listeye dön</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/stok-karti">← Listeye dön</Link>
      <h1>{isNew ? 'Yeni Stok Kartı' : `Stok Kartı #${id}`}</h1>

      <form onSubmit={formik.handleSubmit}>
        <GenelBilgiler formik={formik} stokDegeri={stokDegeri} />

        <button type="submit" disabled={formik.isSubmitting}>
          Kaydet
        </button>
        <Link to="/stok-karti">İptal</Link>
      </form>
    </div>
  );
}

export default StokKartiCard;