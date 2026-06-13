'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiFetch from '../../../utils/api';

export default function AdminProducts() {
  const router = useRouter();
  const { user } = useSelector(s => s.auth);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', spicy_level: 'Doux', available: true });

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/login'); return; }
    Promise.all([
      apiFetch('/api/admin/products'),
      apiFetch('/api/products/categories'),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, router]);

  const toggleAvailability = async (product) => {
    try {
      const updated = await apiFetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({ available: !product.available }),
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, available: updated.available } : p));
    } catch (err) { alert(err.message); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await apiFetch(`/api/admin/products/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...updated } : p));
      } else {
        const created = await apiFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        setProducts(prev => [created, ...prev]);
      }
      setEditing(null);
      setForm({ name: '', description: '', price: '', category_id: '', spicy_level: 'Doux', available: true });
    } catch (err) { alert(err.message); }
  };

  const editProduct = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      spicy_level: product.spicy_level,
      available: !!product.available,
    });
  };

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
          <Link href="/admin/orders" className="nav-link"><i className="bi bi-bag-check me-2"></i>Commandes</Link>
          <Link href="/admin/products" className="nav-link active"><i className="bi bi-grid me-2"></i>Produits</Link>
          <hr className="border-white-10" />
          <Link href="/" className="nav-link"><i className="bi bi-arrow-left me-2"></i>Retour au site</Link>
        </nav>
      </div>
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4"><i className="bi bi-grid me-2"></i>Gestion des produits</h4>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card rounded-4 border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">{editing ? 'Modifier' : 'Ajouter'} un produit</h6>
                <form onSubmit={handleSave}>
                  <div className="mb-2">
                    <label className="form-label small">Nom</label>
                    <input className="form-control form-control-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Description</label>
                    <textarea className="form-control form-control-sm" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Prix (FCFA)</label>
                    <input type="number" className="form-control form-control-sm" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Catégorie</label>
                    <select className="form-select form-select-sm" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} required>
                      <option value="">Choisir...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Niveau de piment</label>
                    <select className="form-select form-select-sm" value={form.spicy_level} onChange={e => setForm(f => ({ ...f, spicy_level: e.target.value }))}>
                      <option value="Doux">Doux</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Pimenté">Pimenté</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-cfc btn-sm flex-grow-1">
                      {editing ? 'Modifier' : 'Ajouter'}
                    </button>
                    {editing && (
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', category_id: '', spicy_level: 'Doux', available: true }); }}>
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            {loading ? <div className="text-center py-5"><div className="spinner-border text-danger"></div></div> : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Prix</th>
                      <th>Piment</th>
                      <th>Disponible</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="fw500">{p.name}</td>
                        <td><span className="badge bg-light text-dark">{p.category_name}</span></td>
                        <td className="fw-bold">{p.price.toLocaleString()} F</td>
                        <td><span className={`badge bg-${p.spicy_level === 'Pimenté' ? 'danger' : p.spicy_level === 'Moyen' ? 'warning' : 'success'} bg-opacity-25 text-dark`}>{p.spicy_level}</span></td>
                        <td>
                          <span className={`badge ${p.available ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                            {p.available ? 'En stock' : 'Rupture'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => editProduct(p)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => toggleAvailability(p)}>
                              <i className={`bi ${p.available ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
