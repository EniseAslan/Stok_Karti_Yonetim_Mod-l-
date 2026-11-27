import type { FocusEvent, ReactNode } from 'react';
import type { FormikProps } from 'formik';
import {
  BIRIM_OPTIONS,
  DURUM_OPTIONS,
  KATEGORI_OPTIONS,
  type StokKartiForm,
} from '../../../types/stokKarti.types';
import { formatCurrency } from '../../../utils/_project/stokKarti';
import styles from './StokKartiCard.module.scss';

interface GenelBilgilerProps {
  formik: FormikProps<StokKartiForm>;
  stokDegeri: number;
}

type ValidatedField = 'ad' | 'stokMiktari' | 'birimFiyat';

const selectOnFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FieldProps) {
  return (
    <div className={styles.field}>
      <label
        htmlFor={htmlFor}
        className={`${styles.label} ${required ? styles.required : ''}`}
      >
        {label}
      </label>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function GenelBilgiler({ formik, stokDegeri }: GenelBilgilerProps) {
  const error = (name: ValidatedField) =>
    formik.touched[name] ? formik.errors[name] : undefined;

  const inputClass = (name: ValidatedField) =>
    `${styles.input} ${error(name) ? styles.invalid : ''}`;

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Genel Bilgiler</h2>

        <div className={styles.fields}>
          <Field label="Stok Kodu" htmlFor="kod">
            <input
              id="kod"
              name="kod"
              type="text"
              className={styles.input}
              value={formik.values.kod}
              onChange={formik.handleChange}
            />
          </Field>

          <Field label="Stok Adı" htmlFor="ad" required error={error('ad')}>
            <input
              id="ad"
              name="ad"
              type="text"
              className={inputClass('ad')}
              value={formik.values.ad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Field>

          <Field label="Kategori" htmlFor="kategori">
            <select
              id="kategori"
              name="kategori"
              className={styles.input}
              value={formik.values.kategori}
              onChange={formik.handleChange}
            >
              {KATEGORI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Birim" htmlFor="birim">
            <select
              id="birim"
              name="birim"
              className={styles.input}
              value={formik.values.birim}
              onChange={formik.handleChange}
            >
              {BIRIM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Durum" htmlFor="durum">
            <select
              id="durum"
              name="durum"
              className={styles.input}
              value={formik.values.durum}
              onChange={formik.handleChange}
            >
              {DURUM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stok ve Fiyat</h2>

        <div className={styles.fields}>
          <Field
            label="Stok Miktarı"
            htmlFor="stokMiktari"
            required
            error={error('stokMiktari')}
          >
            <input
              id="stokMiktari"
              name="stokMiktari"
              type="number"
              step="any"
              className={inputClass('stokMiktari')}
              value={formik.values.stokMiktari}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={selectOnFocus}
            />
          </Field>

          <Field
            label="Birim Fiyat (₺)"
            htmlFor="birimFiyat"
            required
            error={error('birimFiyat')}
          >
            <input
              id="birimFiyat"
              name="birimFiyat"
              type="number"
              step="any"
              className={inputClass('birimFiyat')}
              value={formik.values.birimFiyat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={selectOnFocus}
            />
          </Field>

          <div className={styles.valueBox}>
            <span className={styles.valueLabel}>Stok Değeri</span>
            <strong className={styles.valueAmount}>
              {formatCurrency(stokDegeri)}
            </strong>
          </div>
        </div>
      </section>
    </>
  );
}

export default GenelBilgiler;