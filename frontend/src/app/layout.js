import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'CFC Cameroon - Cameroon Fried Chicken',
  description: 'Cameroon Fried Chicken - Le meilleur du poulet frit et braisé au Cameroun. Livraison rapide à Douala et Yaoundé. Paiement Mobile Money accepté.',
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
