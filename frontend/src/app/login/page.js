'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { loginSuccess } from '../../store/authSlice';
import apiFetch from '../../utils/api';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.push('/menu'); }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });
      dispatch(loginSuccess(data));
      router.push('/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #D32F2F, #B71C1C)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4">
              <Link href="/">
                <img src="/logo.svg" alt="CFC Cameroon" height="50" />
              </Link>
            </div>
            <div className="bg-white rounded-4 shadow-lg p-4">
              <h4 className="fw-bold text-center mb-1">Connexion</h4>
              <p className="text-muted text-center small mb-4">Connectez-vous avec votre numéro de téléphone</p>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw500 small">Numéro de téléphone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">+237</span>
                    <input type="tel" className="form-control" placeholder="690 000 000" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw500 small">Mot de passe</label>
                  <input type="password" className="form-control" placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-cfc w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
              <div className="text-center mt-3">
                <small className="text-muted">Pas encore de compte ? <Link href="/register" className="text-danger fw600">Créer un compte</Link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
