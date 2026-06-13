'use client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const spicyColors = { 'Doux': 'success', 'Moyen': 'warning', 'Pimenté': 'danger' };

  return (
    <div className="product-card shadow-sm h-100 d-flex flex-column">
      <div className="card-img-top d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ background: '#FFF8E1', height: '180px' }}>
        {product.image ? (
          <img src={`/images/${product.image}`} alt={product.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
        ) : (
          <i className="bi bi-egg-fried" style={{ fontSize: '5rem', color: '#FFB300', opacity: 0.6 }}></i>
        )}
        <span className={`badge bg-${spicyColors[product.spicy_level] || 'secondary'} position-absolute top-0 end-0 m-2 spicy-badge`}>
          {product.spicy_level === 'Pimenté' ? '🌶️ ' : ''}{product.spicy_level}
        </span>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0">{product.name}</h6>
          <span className="price">{product.price.toLocaleString()} F</span>
        </div>
        <p className="card-text small text-muted flex-grow-1">{product.description?.substring(0, 60) || 'Savoureux et préparé avec soin'}</p>
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <span className="badge bg-light text-muted small">{product.category_name}</span>
          <button
            className="btn-add-cart"
            onClick={() => dispatch(addItem({
              product_id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              customization_options: product.customization_options,
            }))}
            title="Ajouter au panier"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
