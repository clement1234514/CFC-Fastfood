'use client';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { addItem } from '../../store/cartSlice';
import apiFetch from '../../utils/api';

export default function Menu() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/products/categories'),
      apiFetch('/api/products'),
    ]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? products.filter(p => p.category_slug === activeCategory)
    : products;

  const handleAddToCart = (product) => {
    if (product.customization_options) {
      setSelectedProduct(product);
      setCustomizations({});
      setQty(1);
    } else {
      dispatch(addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }));
    }
  };

  const confirmAdd = () => {
    if (!selectedProduct) return;
    const custStr = Object.entries(customizations).map(([k, v]) => `${k}:${v}`).join('; ');
    dispatch(addItem({
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity: qty,
      customization: custStr || null,
    }));
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Notre Menu</h2>
            <p className="text-muted mb-0 small">Découvrez nos délicieux produits</p>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <button className={`category-pill ${!activeCategory ? 'active' : ''}`} onClick={() => setActiveCategory(null)}>
            Tous
          </button>
          {categories.map(cat => (
            <button key={cat.id} className={`category-pill ${activeCategory === cat.slug ? 'active' : ''}`} onClick={() => setActiveCategory(prev => prev === cat.slug ? null : cat.slug)}>
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-2 text-muted">Chargement du menu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-emoji-neutral"></i>
            <h5>Aucun produit dans cette catégorie</h5>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(product => (
              <div className="col-md-6 col-lg-4 col-xl-3" key={product.id}>
                <div onClick={() => handleAddToCart(product)}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{selectedProduct.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small">{selectedProduct.description}</p>
                {selectedProduct.customization_options?.map((opt, i) => (
                  <div key={i} className="mb-3">
                    <label className="form-label fw600 small text-uppercase">{opt.type}</label>
                    <div className="d-flex flex-wrap gap-2">
                      {opt.options.map((o, j) => (
                        <button key={j}
                          className={`btn btn-sm rounded-pill ${customizations[opt.type] === o ? 'btn-cfc' : 'btn-outline-secondary'}`}
                          onClick={() => setCustomizations(c => ({ ...c, [opt.type]: o }))}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="d-flex align-items-center gap-3 mt-3">
                  <label className="fw600 small">Quantité:</label>
                  <div className="input-group" style={{ width: '120px' }}>
                    <button className="btn btn-outline-secondary" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                    <input type="number" className="form-control text-center" value={qty} readOnly />
                    <button className="btn btn-outline-secondary" onClick={() => setQty(q => q + 1)}>+</button>
                  </div>
                  <span className="fw-bold ms-auto" style={{ color: '#D32F2F', fontSize: '1.2rem' }}>
                    {(selectedProduct.price * qty).toLocaleString()} F
                  </span>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-cfc w-100" onClick={confirmAdd}>
                  <i className="bi bi-cart-plus me-2"></i>Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
