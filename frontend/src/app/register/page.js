'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { loginSuccess } from '../../store/authSlice';
import apiFetch from '../../utils/api';

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.push('/menu'); }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email || undefined, password: form.password }),
      });
      dispatch(loginSuccess(data));
      router.push('/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #D32F2F, #B71C1C)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4">
              <Link href="/">
                <img src="/logo.svg" alt="CFC Cameroon" height="50" />
              </Link>
            </div>
            <div className="bg-white rounded-4 shadow-lg p-4">
              <h4 className="fw-bold text-center mb-1">Créer un compte</h4>
              <p className="text-muted text-center small mb-4">Inscrivez-vous pour commander</p>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw500">Nom complet</label>
                  <input type="text" className="form-control" placeholder="Jean Dupont" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw500">Numéro de téléphone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">+237</span>
                    <input type="tel" className="form-control" placeholder="690 000 000" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw500">Email (optionnel)</label>
                  <input type="email" className="form-control" placeholder="jean@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw500">Mot de passe</label>
                  <input type="password" className="form-control" placeholder="Minimum 6 caractères" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw500">Confirmer le mot de passe</label>
                  <input type="password" className="form-control" placeholder="Répétez le mot de passe" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-cfc w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-person-plus-fill me-2"></i>}
                  {loading ? 'Inscription...' : "S'inscrire"}
                </button>
              </form>
              <div className="text-center mt-3">
                <small className="text-muted">Déjà inscrit ? <Link href="/login" className="text-danger fw600">Se connecter</Link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
