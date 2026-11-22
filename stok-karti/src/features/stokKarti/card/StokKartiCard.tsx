import { Link, useParams } from 'react-router-dom';

function StokKartiCard() {
  const { id } = useParams();
  const isNew = id === undefined;

  return (
    <div>
      <Link to="/stok-karti">← Listeye dön</Link>
      <h1>{isNew ? 'Yeni Stok Kartı' : `Stok Kartı #${id}`}</h1>
    </div>
  );
}

export default StokKartiCard;