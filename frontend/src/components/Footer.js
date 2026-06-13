'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="footer-cfc mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <img src="/logo.svg" alt="CFC Cameroon" height="40" className="mb-2" />
            <h5 className="mb-3 text-white">CFC Cameroon</h5>
            <p>Le meilleur du poulet frit et braisé au Cameroun. Saveur locale, qualité internationale.</p>
            <div className="d-flex gap-2 fs-5">
              <a href="#" className="text-white-50"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
          <div className="col-md-2">
            <h6 className="text-white fw-bold mb-3">Liens</h6>
            <div className="d-flex flex-column gap-2">
              <Link href="/" className="text-white-50 text-decoration-none small">Accueil</Link>
              <Link href="/menu" className="text-white-50 text-decoration-none small">Menu</Link>
              <Link href="/cart" className="text-white-50 text-decoration-none small">Panier</Link>
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-bold mb-3">Contact</h6>
            <div className="small text-white-50 d-flex flex-column gap-1">
              <span><i className="bi bi-telephone-fill me-2"></i>+237 677 000 000</span>
              <span><i className="bi bi-envelope-fill me-2"></i>contact@cfc.cm</span>
              <span><i className="bi bi-geo-alt-fill me-2"></i>Douala - Yaoundé</span>
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-bold mb-3">Horaires</h6>
            <div className="small text-white-50">
              <p className="mb-1">Lun - Sam: 10h - 22h</p>
              <p className="mb-1">Dim: 12h - 20h</p>
            </div>
          </div>
        </div>
        <hr className="my-3 border-white-10" />
        <p className="text-center small text-white-50 mb-0">
          &copy; 2024 Cameroon Fried Chicken. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
