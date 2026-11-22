import { Routes, Route, Navigate } from 'react-router-dom';
import StokKartiList from './features/stokKarti/list/StokKartiList';
import StokKartiCard from './features/stokKarti/card/StokKartiCard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/stok-karti" replace />} />
      <Route path="/stok-karti" element={<StokKartiList />} />
      <Route path="/stok-karti/yeni" element={<StokKartiCard />} />
      <Route path="/stok-karti/:id" element={<StokKartiCard />} />
    </Routes>
  );
}

export default App;