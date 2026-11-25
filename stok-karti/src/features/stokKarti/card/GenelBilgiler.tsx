import type { FormikProps } from "formik";
import type { FocusEvent } from "react";
import {
  BIRIM_OPTIONS,
  DURUM_OPTIONS,
  KATEGORI_OPTIONS,
  type StokKartiForm,
} from "../../../types/stokKarti.types";

interface GenelBilgilerProps {
  formik: FormikProps<StokKartiForm>;
  stokDegeri: number;
}
const selectOnFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();

function GenelBilgiler({ formik, stokDegeri }: GenelBilgilerProps) {
  return (
    <section>
      <h2>Genel Bilgiler</h2>

      <div>
        <label htmlFor="ad">Ad</label>
        <input
          id="ad"
          name="ad"
          type="text"
          value={formik.values.ad}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.ad && formik.errors.ad && <p>{formik.errors.ad}</p>}
      </div>

      <div>
        <label htmlFor="kod">Kod</label>
        <input
          id="kod"
          name="kod"
          type="text"
          value={formik.values.kod}
          onChange={formik.handleChange}
        />
      </div>

      <div>
        <label htmlFor="kategori">Kategori</label>
        <select
          id="kategori"
          name="kategori"
          value={formik.values.kategori}
          onChange={formik.handleChange}
        >
          {KATEGORI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="birim">Birim</label>
        <select
          id="birim"
          name="birim"
          value={formik.values.birim}
          onChange={formik.handleChange}
        >
          {BIRIM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="stokMiktari">Stok Miktarı</label>
        <input
          id="stokMiktari"
          name="stokMiktari"
          type="number"
          step="any"
          value={formik.values.stokMiktari}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={selectOnFocus}
        />
        {formik.touched.stokMiktari && formik.errors.stokMiktari && (
          <p>{formik.errors.stokMiktari}</p>
        )}
      </div>

      <div>
        <label htmlFor="birimFiyat">Birim Fiyat (₺)</label>
        <input
          id="birimFiyat"
          name="birimFiyat"
          type="number"
          step="any"
          value={formik.values.birimFiyat}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={selectOnFocus}
        />
        {formik.touched.birimFiyat && formik.errors.birimFiyat && (
          <p>{formik.errors.birimFiyat}</p>
        )}
      </div>

      <div>
        <label htmlFor="durum">Durum</label>
        <select
          id="durum"
          name="durum"
          value={formik.values.durum}
          onChange={formik.handleChange}
        >
          {DURUM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <p>
        Stok Değeri:{" "}
        <strong>
          {stokDegeri.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          })}
        </strong>
      </p>
    </section>
  );
}

export default GenelBilgiler;
