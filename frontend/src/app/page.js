'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrate } from '../store/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(hydrate()); }, [dispatch]);

  return (
    <>
      <Navbar />
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <img src="/logo.svg" alt="CFC Cameroon" height="70" className="mb-3" />
          <h1>Cameroon<br /><span style={{ color: '#FFB300' }}>Fried Chicken</span></h1>
              <p className="hero-subtitle">Découvrez le meilleur du poulet frit et braisé, préparé avec des épices locales et un savoir-faire unique. Livraison rapide à Douala et Yaoundé.</p>
              <div className="d-flex gap-3 mt-4">
                <Link href="/menu" className="btn btn-cfc-yellow btn-lg rounded-pill px-4">
                  <i className="bi bi-grid-fill me-2"></i>Notre Menu
                </Link>
                <Link href="/cart" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  <i className="bi bi-cart-fill me-2"></i>Commander
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img src="/accueil.png" alt="CFC Cameroon" className="img-fluid" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Pourquoi Choisir CFC ?</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-fire', title: 'Goût Authentique', desc: 'Recettes traditionnelles camerounaises revisitées' },
              { icon: 'bi-truck', title: 'Livraison Rapide', desc: 'Livraison en 30-45 min dans votre quartier' },
              { icon: 'bi-phone', title: 'Mobile Money', desc: 'Paiement MTN Mobile Money & Orange Money accepté' },
              { icon: 'bi-shield-check', title: 'Qualité Garantie', desc: 'Produits frais, halal, préparés sur place' },
            ].map((item, i) => (
              <div className="col-md-3 col-6" key={i}>
                <div className="text-center p-4 bg-white rounded-4 shadow-sm h-100">
                  <i className={`bi ${item.icon}`} style={{ fontSize: '2.5rem', color: '#D32F2F' }}></i>
                  <h6 className="fw-bold mt-3 mb-2">{item.title}</h6>
                  <p className="small text-muted mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--cfc-cream)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Nos Quartiers de Livraison</h2>
          </div>
          <div className="row justify-content-center">
            {[
              { city: 'Douala', zones: ['Bonapriso', 'Akwa', 'Bonanjo', 'Deido', 'Logbessou', 'Makepe'] },
              { city: 'Yaoundé', zones: ['Bastos', 'Essos', 'Ngoa-Ekelle', 'Mvog-Mbi', 'Biyem-Assi', 'Melen'] },
            ].map((zone, i) => (
              <div className="col-md-5" key={i}>
                <div className="bg-white rounded-4 shadow-sm p-4 mb-3">
                  <h5 className="fw-bold mb-3"><i className="bi bi-geo-alt-fill" style={{ color: '#D32F2F' }}></i> {zone.city}</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {zone.zones.map((z, j) => (
                      <span key={j} className="badge bg-light text-dark rounded-pill px-3 py-2">{z}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
