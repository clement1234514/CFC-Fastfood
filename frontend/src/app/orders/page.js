'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import apiFetch from '../../utils/api';

const statusColors = {
  'en_attente': 'warning', 'payee': 'info', 'en_preparation': 'primary',
  'livraison': 'orange', 'terminee': 'success', 'annulee': 'danger',
};
const statusLabels = {
  'en_attente': 'En attente', 'payee': 'Payée', 'en_preparation': 'En préparation',
  'livraison': 'En livraison', 'terminee': 'Terminée', 'annulee': 'Annulée',
};

export default function Orders() {
  const router = useRouter();
  const { user } = useSelector(s => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    apiFetch('/api/orders')
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4"><i className="bi bi-bag-check-fill me-2" style={{ color: '#D32F2F' }}></i>Mes Commandes</h2>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bag-x"></i>
            <h5>Aucune commande</h5>
            <Link href="/menu" className="btn btn-cfc"><i className="bi bi-grid-fill me-2"></i>Commander maintenant</Link>
          </div>
        ) : (
          <div className="row g-3">
            {orders.map(order => (
              <div key={order.id} className="col-md-6">
                <Link href={`/orders/${order.id}`} className="text-decoration-none">
                  <div className="card rounded-4 border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-1">#{order.id.slice(0, 8).toUpperCase()}</h6>
                          <small className="text-muted">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                        <span className={`badge bg-${statusColors[order.status]} rounded-pill`}>{statusLabels[order.status]}</span>
                      </div>
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <span key={i} className="badge bg-light text-dark">{item.product_name} x{item.quantity}</span>
                        ))}
                        {order.items?.length > 3 && <span className="badge bg-light text-dark">+{order.items.length - 3}</span>}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: '#D32F2F' }}>{order.total.toLocaleString()} F</span>
                        <span className="small text-muted"><i className="bi bi-geo-alt me-1"></i>{order.delivery_zone}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
