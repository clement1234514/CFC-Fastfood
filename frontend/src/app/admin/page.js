'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiFetch from '../../utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'livreur')) {
      router.push('/login');
      return;
    }
    apiFetch('/api/admin/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  return (
    <div className="d-flex">
      <div className="admin-sidebar" style={{ width: 250 }}>
        <div className="text-center mb-4 mt-2">
          <Link href="/">
            <img src="/logo.svg" alt="CFC" height="40" className="mb-2" />
          </Link>
        </div>
        <nav className="nav flex-column">
          <Link href="/admin" className="nav-link active"><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link>
          <Link href="/admin/orders" className="nav-link"><i className="bi bi-bag-check me-2"></i>Commandes</Link>
          <Link href="/admin/products" className="nav-link"><i className="bi bi-grid me-2"></i>Produits</Link>
          <hr className="border-white-10" />
          <Link href="/" className="nav-link"><i className="bi bi-arrow-left me-2"></i>Retour au site</Link>
        </nav>
      </div>
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Tableau de bord</h4>

        {loading ? <div className="text-center py-5"><div className="spinner-border text-danger"></div></div> : stats ? (
          <>
            <div className="row g-3 mb-4">
              {[
                { label: 'Commandes aujourd\'hui', value: stats.ordersToday, icon: 'bi-bag-check', color: '#D32F2F' },
                { label: 'Revenu aujourd\'hui', value: `${stats.revenueToday.toLocaleString()} F`, icon: 'bi-currency-dollar', color: '#2E7D32' },
                { label: 'Total commandes', value: stats.totalOrders, icon: 'bi-graph-up', color: '#1565C0' },
                { label: 'Revenu total', value: `${stats.totalRevenue.toLocaleString()} F`, icon: 'bi-piggy-bank', color: '#FF6F00' },
              ].map((card, i) => (
                <div className="col-md-3" key={i}>
                  <div className="stat-card" style={{ background: card.color }}>
                    <i className={`bi ${card.icon} fs-2`}></i>
                    <div className="stat-number mt-2">{card.value}</div>
                    <div className="stat-label">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="card rounded-4 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Commandes par statut</h6>
                    {stats.byStatus.map(s => (
                      <div key={s.status} className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-capitalize">{s.status.replace('_', ' ')}</span>
                        <span className="badge bg-dark rounded-pill">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card rounded-4 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Commandes récentes</h6>
                    {stats.recentOrders.map(o => (
                      <div key={o.id} className="d-flex justify-content-between align-items-center mb-2 small">
                        <span>#{o.id.slice(0, 8).toUpperCase()} - {o.user_name}</span>
                        <span className={`badge bg-${o.status === 'terminee' ? 'success' : o.status === 'en_preparation' ? 'primary' : o.status === 'livraison' ? 'warning' : 'secondary'} rounded-pill`}>
                          {o.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
