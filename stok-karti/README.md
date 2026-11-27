# Stok Kartı Yönetim Modülü

A small stock card (inventory item) management module built as a Datasoft internship project.
It follows the **List → Card → Modal** architecture: a list page, a card page used for both
creating and editing, and a depot selection modal.

## Features

- **List page:** search by name or code, filter by category and status, summary cards
  (listed items, active cards, total stock value), edit / quick edit / delete actions
- **Card page:** create and edit with Formik and Yup validation, derived stock value
  (`stokMiktari * birimFiyat`), depot selection through a modal
- **Quick edit:** the same card component opens in a modal from the list (`isInModal`)
- **Notifications:** linked messages after create, update and delete
  ("Kayıt oluşturuldu", "Kayıt güncellendi", "Kayıt silindi")
- **Edge cases:** empty list state, load error with a "Tekrar dene" retry, save and delete
  errors, validation summary, record not found, empty filter result with "Filtreleri temizle"

## Tech stack

- Vite, React, TypeScript (strict mode)
- Formik and Yup
- React Router
- SCSS with CSS Modules
- json-server as a mock API

## Getting started

```bash
cd stok-karti
npm install
```

Start the mock API (port 3002) in one terminal:

```bash
npm run api
```

Start the app in a second terminal:

```bash
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Routes

| Path | Page |
|---|---|
| `/stok-karti` | Stock card list |
| `/stok-karti/yeni` | New stock card |
| `/stok-karti/:id` | Edit stock card |

## Project structure

```
stok-karti/src
├── api/                 mock API client
├── components/          shared components (Notification)
├── features/stokKarti/
│   ├── list/            list page
│   ├── card/            card page (also used as a modal)
│   └── modal/           depot selection modal
├── styles/              global CSS variables (_base.scss)
├── types/               types, enums and label maps
└── utils/project/      helpers (currency, number, stock value)
```

## Conventions

- Enum values and their labels are defined in one place; dropdown options are generated from them
- Form values are updated with a single `setValues({ ...values, ... })` call
- The stock value is derived with `useMemo`, never stored in state
- Lists are filtered by derived values, not by extra state
- The list only keeps records that have the fields the UI needs (`ad`, `kod`)

## Deviations from the assignment document

- Styles use **CSS Modules** (`*.module.scss` next to each component), following the
  company convention advised by the mentor, instead of plain `.scss` files with BEM names