'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { hydrate, logout } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const cartCount = useSelector(selectCartCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(hydrate());
    setMounted(true);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-cfc sticky-top" suppressHydrationWarning>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <img src="/logo.svg" alt="CFC Cameroon" height="42" className="me-2" />
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/"><i className="bi bi-house-fill me-1"></i>Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/menu"><i className="bi bi-grid-fill me-1"></i>Menu</Link>
            </li>
            {mounted && user && (
              <li className="nav-item">
                <Link className="nav-link" href="/orders"><i className="bi bi-bag-check-fill me-1"></i>Mes Commandes</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link href="/cart" className="position-relative text-white text-decoration-none">
              <i className="bi bi-cart-fill fs-5"></i>
              {mounted && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            {mounted && user ? (
              <div className="dropdown">
                <button className="btn btn-sm text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>{user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" href="/orders">Mes Commandes</Link></li>
                  {(user.role === 'admin' || user.role === 'livreur') && (
                    <li><Link className="dropdown-item" href="/admin">Administration</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Déconnexion</button></li>
                </ul>
              </div>
            ) : (
              mounted && (
                <Link href="/login" className="btn btn-cfc-yellow btn-sm rounded-pill px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Connexion
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
