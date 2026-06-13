'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { io } from 'socket.io-client';
import apiFetch from '../../../utils/api';

const statusColors = { 'en_attente': 'warning', 'payee': 'info', 'en_preparation': 'primary', 'livraison': 'orange', 'terminee': 'success', 'annulee': 'danger' };
const statusLabels = { 'en_attente': 'En attente', 'payee': 'Payée', 'en_preparation': 'En préparation', 'livraison': 'En livraison', 'terminee': 'Terminée', 'annulee': 'Annulée' };

export default function AdminOrders() {
  const router = useRouter();
  const { user } = useSelector(s => s.auth);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'livreur')) {
      router.push('/login');
      return;
    }

    const socket = io('http://localhost:5000');
    socket.emit('join-admin');

    socket.on('new-order', (order) => {
      setOrders(prev => [order, ...prev]);
      setNewOrderAlert(order);
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f3+AgH9/f3+AgH+AgIB/f3+AgH+AgIB/f3+AgH+AgIB/f3+AgH+AgICAf39/f4CAgH9/f3+AgH+AgIB/f3+AgH+AgIB/f3+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAf39/gH+AgICAgI=');
        audio.play().catch(() => {});
      } catch (e) {}
      setTimeout(() => setNewOrderAlert(null), 5000);
    });

    socket.on('order-status-changed', ({ order_id, status }) => {
      setOrders(prev => prev.map(o => o.id === order_id ? { ...o, status } : o));
    });

    apiFetch('/api/admin/orders').then(setOrders).catch(() => {}).finally(() => setLoading(false));
    apiFetch('/api/admin/couriers').then(setCouriers).catch(() => {});

    return () => socket.disconnect();
  }, [user, router]);

  const updateStatus = async (orderId, status, courierId) => {
    try {
      const updated = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, courier_id: courierId }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
    } catch (err) { alert(err.message); }
  };

  const filteredOrders = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="d-flex">
      <div className="admin-sidebar" style={{ width: 250 }}>
        <div className="text-center mb-4 mt-2">
          <Link href="/">
            <img src="/logo.svg" alt="CFC" height="40" className="mb-2" />
          </Link>
        </div>
        <nav className="nav flex-column">
          <Link href="/admin" className="nav-link"><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link>
          <Link href="/admin/orders" className="nav-link active"><i className="bi bi-bag-check me-2"></i>Commandes</Link>
          <Link href="/admin/products" className="nav-link"><i className="bi bi-grid me-2"></i>Produits</Link>
          <hr className="border-white-10" />
          <Link href="/" className="nav-link"><i className="bi bi-arrow-left me-2"></i>Retour au site</Link>
        </nav>
      </div>
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0"><i className="bi bi-bag-check me-2"></i>Gestion des commandes</h4>
        </div>

        {newOrderAlert && (
          <div className="alert alert-success order-alert d-flex justify-content-between align-items-center">
            <span>🆕 Nouvelle commande #{newOrderAlert.id.slice(0, 8).toUpperCase()} - {newOrderAlert.total.toLocaleString()} F</span>
            <button className="btn btn-sm btn-success" onClick={() => setNewOrderAlert(null)}>OK</button>
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 mb-4">
          <button className={`btn btn-sm rounded-pill ${!filter ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFilter('')}>Toutes</button>
          {Object.entries(statusLabels).map(([key, label]) => (
            <button key={key} className={`btn btn-sm rounded-pill ${filter === key ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <div className="text-center py-5"><div className="spinner-border text-danger"></div></div> : filteredOrders.length === 0 ? (
          <div className="empty-state"><i className="bi bi-inbox"></i><h5>Aucune commande</h5></div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="card rounded-4 border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h6 className="fw-bold mb-1">#{order.id.slice(0, 8).toUpperCase()}</h6>
                    <small className="text-muted">{order.user_name} - {order.user_phone} | {new Date(order.created_at).toLocaleString('fr-FR')}</small>
                  </div>
                  <span className={`badge bg-${statusColors[order.status]} rounded-pill fs-6`}>{statusLabels[order.status]}</span>
                </div>
                <div className="d-flex flex-wrap gap-1 my-2">
                  {order.items?.map((item, i) => (
                    <span key={i} className="badge bg-light text-dark border">{item.product_name} x{item.quantity} @ {item.unit_price.toLocaleString()}F</span>
                  ))}
                </div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="fw-bold fs-5" style={{ color: '#D32F2F' }}>{order.total.toLocaleString()} F</span>
                  <span className="small"><i className="bi bi-geo-alt me-1"></i>{order.delivery_zone}</span>
                  <div className="d-flex gap-2 flex-wrap">
                    {order.status === 'en_attente' && (
                      <button className="btn btn-sm btn-primary" onClick={() => updateStatus(order.id, 'en_preparation')}>
                        <i className="bi bi-fire me-1"></i>En préparation
                      </button>
                    )}
                    {order.status === 'payee' && (
                      <button className="btn btn-sm btn-primary" onClick={() => updateStatus(order.id, 'en_preparation')}>
                        <i className="bi bi-fire me-1"></i>En préparation
                      </button>
                    )}
                    {order.status === 'en_preparation' && (
                      <>
                        <button className="btn btn-sm btn-warning" onClick={() => updateStatus(order.id, 'livraison')}>
                          <i className="bi bi-truck me-1"></i>En livraison
                        </button>
                        <select className="form-select form-select-sm" style={{ width: 'auto' }} onChange={(e) => {
                          if (e.target.value) updateStatus(order.id, 'livraison', e.target.value);
                        }}>
                          <option value="">Assigner livreur</option>
                          {couriers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                        </select>
                      </>
                    )}
                    {order.status === 'livraison' && (
                      <button className="btn btn-sm btn-success" onClick={() => updateStatus(order.id, 'terminee')}>
                        <i className="bi bi-check-lg me-1"></i>Terminée
                      </button>
                    )}
                    {order.status !== 'terminee' && order.status !== 'annulee' && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(order.id, 'annulee')}>
                        <i className="bi bi-x-lg me-1"></i>Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
