'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import apiFetch from '../../../utils/api';
import { io } from 'socket.io-client';

const statusConfig = {
  'en_attente': { icon: 'bi-clock', label: 'Commande reçue', desc: 'Votre commande a été enregistrée' },
  'payee': { icon: 'bi-credit-card', label: 'Paiement confirmé', desc: 'Le paiement a été validé' },
  'en_preparation': { icon: 'bi-fire', label: 'En préparation', desc: 'Votre commande est en cours de préparation' },
  'livraison': { icon: 'bi-truck', label: 'En cours de livraison', desc: 'Votre commande est en route' },
  'terminee': { icon: 'bi-check-circle', label: 'Livrée', desc: 'Bon appétit !' },
};

const statusOrder = ['en_attente', 'payee', 'en_preparation', 'livraison', 'terminee'];

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useSelector(s => s.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    const socket = io('http://localhost:5000');
    socket.emit('join-order', params.id);

    socket.on('order-update', (data) => {
      setOrder(data);
    });

    apiFetch(`/api/orders/${params.id}`)
      .then(setOrder)
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));

    return () => socket.disconnect();
  }, [params.id, user, router]);

  if (loading) return (
    <>
      <Navbar />
      <div className="container py-5 text-center"><div className="spinner-border text-danger"></div></div>
      <Footer />
    </>
  );

  if (!order) return null;

  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card rounded-4 border-0 shadow-sm mb-4">
              <div className="card-body p-4 text-center">
                <h4 className="fw-bold mb-1">
                  {order.status === 'terminee' ? 'Commande livrée 🎉' :
                   order.status === 'livraison' ? '🚚 En route !' :
                   order.status === 'annulee' ? '❌ Commande annulée' :
                   '🍗 Commande en cours'}
                </h4>
                <p className="text-muted mb-0">Commande #{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            {order.status !== 'annulee' && (
              <div className="card rounded-4 border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="order-timeline">
                    {statusOrder.map((s, i) => {
                      const cfg = statusConfig[s];
                      const isCompleted = i <= currentIdx;
                      const isActive = i === currentIdx;
                      return (
                        <div key={s} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                          <div className="d-flex align-items-center gap-3">
                            <i className={`bi ${cfg.icon} fs-4 ${isCompleted ? 'text-success' : isActive ? 'text-warning' : 'text-muted'}`}></i>
                            <div>
                              <h6 className={`fw-bold mb-0 ${isCompleted || isActive ? '' : 'text-muted'}`}>{cfg.label}</h6>
                              <small className={`${isCompleted || isActive ? 'text-muted' : 'text-muted opacity-50'}`}>{cfg.desc}</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="card rounded-4 border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Détails de la commande</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Zone de livraison</span>
                  <span className="fw500">{order.delivery_zone}</span>
                </div>
                {order.delivery_address && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Adresse</span>
                    <span className="fw500">{order.delivery_address}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Mode de paiement</span>
                  <span className="fw500">{order.payment_type === 'momo' ? 'Mobile Money' : 'Espèces'}</span>
                </div>
                <hr />
                {order.items?.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between mb-2">
                    <span>{item.product_name} x{item.quantity}</span>
                    <span className="fw500">{(item.unit_price * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Frais de livraison</span>
                  <span>{order.delivery_fee.toLocaleString()} F</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                  <span>Total</span>
                  <span style={{ color: '#D32F2F' }}>{order.total.toLocaleString()} F</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
