'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { removeItem, updateQuantity, selectCartTotal } from '../../store/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);
  const total = useSelector(selectCartTotal);
  const { user } = useSelector(s => s.auth);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4"><i className="bi bi-cart-fill me-2" style={{ color: '#D32F2F' }}></i>Mon Panier</h2>

        {items.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-cart-x"></i>
            <h5>Votre panier est vide</h5>
            <p className="text-muted">Ajoutez des produits depuis notre menu</p>
            <Link href="/menu" className="btn btn-cfc"><i className="bi bi-grid-fill me-2"></i>Voir le menu</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {items.map((item, idx) => (
                <div key={idx} className="card rounded-4 shadow-sm mb-3 border-0">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 70, height: 70, background: 'var(--cfc-cream)', borderRadius: 12 }}>
                      <i className="bi bi-egg-fried" style={{ fontSize: '2rem', color: '#FFB300' }}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      {item.customization && <small className="text-muted">{item.customization}</small>}
                      <div className="fw-bold" style={{ color: '#D32F2F' }}>{item.price.toLocaleString()} F</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="input-group input-group-sm" style={{ width: 100 }}>
                        <button className="btn btn-outline-secondary" onClick={() => dispatch(updateQuantity({ product_id: item.product_id, customization: item.customization, quantity: item.quantity - 1 }))}>-</button>
                        <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                        <button className="btn btn-outline-secondary" onClick={() => dispatch(updateQuantity({ product_id: item.product_id, customization: item.customization, quantity: item.quantity + 1 }))}>+</button>
                      </div>
                      <span className="fw-bold" style={{ minWidth: 80, textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString()} F</span>
                      <button className="btn btn-sm text-danger" onClick={() => dispatch(removeItem({ product_id: item.product_id, customization: item.customization }))}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="card rounded-4 shadow-sm border-0 sticky-top" style={{ top: 90 }}>
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Récapitulatif</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Sous-total</span>
                    <span>{total.toLocaleString()} F</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Frais de livraison</span>
                    <span>À calculer</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                    <span>Total estimé</span>
                    <span style={{ color: '#D32F2F' }}>{total.toLocaleString()} F</span>
                  </div>
                  <Link href={user ? '/checkout' : '/login'} className="btn btn-cfc w-100">
                    <i className="bi bi-credit-card me-2"></i>Commander
                  </Link>
                  <Link href="/menu" className="btn btn-cfc-outline w-100 mt-2">
                    <i className="bi bi-plus-circle me-2"></i>Ajouter des articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
