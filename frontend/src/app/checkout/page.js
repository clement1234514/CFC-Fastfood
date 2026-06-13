'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { clearCart, selectCartTotal } from '../../store/cartSlice';
import apiFetch from '../../utils/api';

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items } = useSelector(s => s.cart);
  const subtotal = useSelector(selectCartTotal);
  const [zones, setZones] = useState({});
  const [selectedZone, setSelectedZone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentType, setPaymentType] = useState('momo');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    apiFetch('/api/orders/zones').then(setZones).catch(() => {});
  }, [user, router]);

  const deliveryFee = zones[selectedZone] || 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedZone) { setError('Veuillez sélectionner une zone de livraison'); return; }
    if (!items.length) { setError('Votre panier est vide'); return; }
    setLoading(true);
    setError('');
    try {
      const order = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            customization: i.customization || null,
          })),
          delivery_zone: selectedZone,
          delivery_address: address || null,
          payment_type: paymentType,
          notes: notes || null,
        }),
      });

      if (paymentType === 'momo') {
        await apiFetch('/api/payments/initiate', {
          method: 'POST',
          body: JSON.stringify({ order_id: order.id, payment_method: 'momo' }),
        });
      }

      dispatch(clearCart());
      setOrderResult(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="bg-white rounded-4 shadow-sm p-5">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                <h3 className="fw-bold mt-3">Commande Confirmée !</h3>
                <p className="text-muted">Votre commande a été reçue et est en cours de traitement.</p>
                <p className="fw-bold">Commande # {orderResult.id.slice(0, 8).toUpperCase()}</p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-cfc" onClick={() => router.push(`/orders/${orderResult.id}`)}>
                    <i className="bi bi-eye me-2"></i>Suivre ma commande
                  </button>
                  <button className="btn btn-cfc-outline" onClick={() => router.push('/menu')}>
                    <i className="bi bi-grid-fill me-2"></i>Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4"><i className="bi bi-credit-card me-2" style={{ color: '#D32F2F' }}></i>Finaliser la commande</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card rounded-4 border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Zone de livraison</h5>
                  <div className="row g-2">
                    {Object.entries(zones).map(([zone, fee]) => (
                      <div className="col-md-4 col-6" key={zone}>
                        <button type="button"
                          className={`btn w-100 rounded-3 p-3 text-center ${selectedZone === zone ? 'btn-cfc' : 'btn-outline-secondary'}`}
                          onClick={() => setSelectedZone(zone)}
                        >
                          <div className="fw600">{zone}</div>
                          <small>{fee.toLocaleString()} F</small>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card rounded-4 border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Adresse de livraison</h5>
                  <div className="mb-3">
                    <label className="form-label small">Point de repère / Adresse</label>
                    <input type="text" className="form-control" placeholder="Ex: Carrefour Bonapriso, près de l'église" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Notes pour le livreur (optionnel)</label>
                    <textarea className="form-control" rows={2} placeholder="Ex: Sonner 2 fois, bâtiment vert" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                  </div>
                </div>
              </div>

              <div className="card rounded-4 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Mode de paiement</h5>
                  <div className="d-flex gap-3">
                    <button type="button"
                      className={`btn flex-fill rounded-3 p-3 text-center ${paymentType === 'momo' ? 'btn-cfc' : 'btn-outline-secondary'}`}
                      onClick={() => setPaymentType('momo')}
                    >
                      <i className="bi bi-phone fs-4 d-block mb-1"></i>
                      <span className="fw600">Mobile Money</span>
                      <small className="d-block">MTN / Orange Money</small>
                    </button>
                    <button type="button"
                      className={`btn flex-fill rounded-3 p-3 text-center ${paymentType === 'cash' ? 'btn-cfc' : 'btn-outline-secondary'}`}
                      onClick={() => setPaymentType('cash')}
                    >
                      <i className="bi bi-cash fs-4 d-block mb-1"></i>
                      <span className="fw600">À la livraison</span>
                      <small className="d-block">Espèces acceptées</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card rounded-4 border-0 shadow-sm sticky-top" style={{ top: 90 }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Récapitulatif</h5>
                  {items.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between small mb-2">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="fw500">{(item.price * item.quantity).toLocaleString()} F</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} F</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Livraison</span>
                    <span className="fw500">{deliveryFee > 0 ? `${deliveryFee.toLocaleString()} F` : 'Sélectionnez une zone'}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                    <span>Total</span>
                    <span style={{ color: '#D32F2F' }}>{total.toLocaleString()} F</span>
                  </div>
                  <button type="submit" className="btn btn-cfc w-100" disabled={loading || items.length === 0}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
                    {loading ? 'Traitement...' : `Confirmer la commande`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
