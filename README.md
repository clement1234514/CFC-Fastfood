
  # CFC Cameroon - Cameroon Fried Chicken

  Online-Bestellplattform für **Cameroon Fried Chicken (CFC)**, ein an den kamerunischen Markt angepasstes Fast-Food-Restaurant mit Mobile Money, Lieferung in Zonen (Douala & Yaoundé) und lokaler Speisekarte.

  ## Technologie-Stack

  | Ebene | Technologie |
  |-------|-------------|
  | **Frontend** | Next.js 14, React 18, Bootstrap 5, Redux Toolkit, Socket.IO Client |
  | **Backend** | Node.js, Express, Socket.IO, JWT, better-sqlite3 |
  | **Datenbank** | SQLite (better-sqlite3), WAL-Modus |
  | **Zahlung** | Mobile Money (MTN / Orange Money) simuliert + Cash on Delivery |

  ## Projektstruktur

  ```
  CFC/
  ├── frontend/          # Next.js-Anwendung (Web-Client)
  │   ├── src/
  │   │   ├── app/          # Next.js-Seiten (App Router)
  │   │   ├── components/   # Wiederverwendbare Komponenten
  │   │   ├── store/        # Redux (authSlice, cartSlice)
  │   │   └── utils/        # api.js, socket.js
  │   └── public/
  │       ├── logo.svg      # Offizielles Logo
  │       └── images/       # Produktfotos
  ├── backend/           # Express-API + WebSocket
  │   ├── routes/        # auth, products, orders, payments, admin
  │   ├── middleware/    # JWT auth, adminOnly
  │   └── server.js      # Einstiegspunkt
  ├── database/          # SQLite-Datenschicht
  │   ├── db.js          # Schema und Verbindung
  │   ├── seed.js        # Anfangsdaten (26 Produkte)
  │   └── cfc.db         # Datenbankdatei
  └── Bilder/            # Quell-Assets (Logos, Produktfotos)
  ```

  ## Installation

  ### Voraussetzungen
  - Node.js >= 18
  - npm

  ### 1. Datenbank
  ```bash
  cd database
  npm install
  npm run seed
  ```

  ### 2. Backend
  ```bash
  cd backend
  npm install
  npm start            # http://localhost:5000
  ```

  ### 3. Frontend
  ```bash
  cd frontend
  npm install
  npx next dev -p 3000 # http://localhost:3000
  ```

  ### Schnellstart (Alles-in-Einem)
  ```bash
  start.bat
  ```

  ---

  ## Frontend (Benutzeroberfläche)

  ### Seiten

  | Route | Beschreibung |
  |-------|--------------|
  | `/` | Startseite mit Hero-Bereich, Vorteilen, Lieferzonen |
  | `/login` | Anmeldung per Telefonnummer |
  | `/register` | Registrierung |
  | `/menu` | Produktkatalog mit 6 Kategorien, Filtern, Anpassung |
  | `/cart` | Warenkorb mit Mengenänderung |
  | `/checkout` | Bestellabschluss: Zone, Adresse, Zahlung |
  | `/orders` | Bestellhistorie |
  | `/orders/[id]` | Echtzeit-Bestellverfolgung (Socket.IO) |
  | `/admin` | Admin-Dashboard (Statistiken, Umsatz) |
  | `/admin/orders` | Bestellverwaltung mit Sound-Benachrichtigungen |
  | `/admin/products` | Produkte CRUD, Verfügbarkeit umschalten |

  ### Komponentenarchitektur

  ```
  RootLayout (layout.js)
  └── Providers (Redux + Hydration)
      ├── Navbar (responsive Navigation)
      ├── Seiten
      │   ├── Home (Hero + Vorteile + Zonen)
      │   ├── Menu → ProductCard (x N)
      │   ├── Cart
      │   ├── Checkout (Zonen, Adresse, Zahlung)
      │   └── Admin
      │       ├── Dashboard (Statistik-Karten)
      │       ├── OrdersList (mit Status-Aktionen)
      │       └── ProductManager (CRUD-Tabelle)
      └── Footer
  ```

  ### Zustandsverwaltung (Redux Toolkit)

  **authSlice** : `user`, `token`
  - `loginSuccess` → speichert in localStorage
  - `logout` → löscht localStorage
  - `hydrate` → stellt aus localStorage wieder her (beim Mount)

  **cartSlice** : `items[]`
  - `addItem` / `removeItem` / `updateQuantity` / `clearCart`
  - Automatische Persistenz in `localStorage('cfc_cart')`
  - Selektoren: `selectCartTotal`, `selectCartCount`

  ### Benutzerablauf

  **Eine Bestellung aufgeben:**
  1. `/register` oder `/login` (Authentifizierung per Telefon)
  2. `/menu` → auf Produkt klicken → Personalisierung (optional)
  3. `/cart` → Artikel prüfen
  4. `/checkout` → Lieferzone wählen → Adresse → Zahlung (Mobile Money oder bar)
  5. Bestätigung → `/orders/[id]` → Echtzeitverfolgung

  ---

  ## Backend (API)

  ### Authentifizierung

  - **JWT** (JSON Web Token) mit 7 Tagen Gültigkeit
  - Header: `Authorization: Bearer <token>`
  - Middleware `auth`: prüft Token, injectiert `req.user`
  - Middleware `adminOnly`: beschränkt auf Rollen `admin` / `livreur`
  - Rollen: `client` (Kunde), `livreur` (Lieferant), `admin` (Administrator)

  ### Endpunkte

  #### Authentifizierung
  | Methode | Route | Auth | Beschreibung |
  |---------|-------|------|--------------|
  | POST | `/api/auth/register` | - | Konto erstellen (name, phone, password) |
  | POST | `/api/auth/login` | - | Anmeldung (phone, password) → JWT |
  | GET | `/api/auth/me` | auth | Aktuelles Benutzerprofil |

  #### Produkte
  | Methode | Route | Auth | Beschreibung |
  |---------|-------|------|--------------|
  | GET | `/api/products` | - | Alle verfügbaren Produkte |
  | GET | `/api/products?category=slug` | - | Nach Kategorie filtern |
  | GET | `/api/products/categories` | - | Kategorienliste |
  | GET | `/api/products/:id` | - | Produktdetails |

  #### Bestellungen
  | Methode | Route | Auth | Beschreibung |
  |---------|-------|------|--------------|
  | GET | `/api/orders/zones` | - | Lieferzonen + Gebühren |
  | POST | `/api/orders` | auth | Bestellung aufgeben |
  | GET | `/api/orders` | auth | Meine Bestellungen (Kunde) oder alle (Admin) |
  | GET | `/api/orders/:id` | auth | Bestelldetails |

  #### Zahlung
  | Methode | Route | Auth | Beschreibung |
  |---------|-------|------|--------------|
  | POST | `/api/payments/initiate` | auth | Mobile Money-Zahlung einleiten (simuliert: bestätigt nach 3s) |
  | POST | `/api/payments/confirm` | auth | Zahlung manuell bestätigen |
  | GET | `/api/payments/methods` | - | Verfügbare Zahlungsmethoden |

  #### Admin
  | Methode | Route | Auth | Beschreibung |
  |---------|-------|------|--------------|
  | GET | `/api/admin/stats` | admin | Statistiken (Bestellungen, Umsatz) |
  | GET | `/api/admin/orders` | admin | Alle Bestellungen |
  | PUT | `/api/admin/orders/:id/status` | admin | Status aktualisieren |
  | GET | `/api/admin/products` | admin | Alle Produkte (Admin) |
  | POST | `/api/admin/products` | admin | Produkt erstellen |
  | PUT | `/api/admin/products/:id` | admin | Produkt bearbeiten |
  | GET | `/api/admin/couriers` | admin | Lieferantenliste |

  #### Gesundheit
  | Methode | Route | Auth | Beschreibung |
  |---------|-------|------|--------------|
  | GET | `/api/health` | - | Server-Status |

  ### WebSocket (Socket.IO)

  - **`join-order`** (Client): Bestell-Raum betreten → erhält `order-update`
  - **`join-admin`** (Admin): Admin-Raum betreten → erhält `new-order`, `order-paid`, `order-status-changed`
  - Server-Ereignisse: `order-update`, `new-order`, `order-paid`, `order-status-changed`

  ### Fehlerbehandlung

  | Code | Bedeutung |
  |------|-----------|
  | 400 | Ungültige Anfrage (fehlende Felder, Produkt nicht verfügbar) |
  | 401 | Fehlender, ungültiger oder abgelaufener Token |
  | 403 | Zugriff verweigert (unzureichende Rolle) |
  | 404 | Ressource nicht gefunden |
  | 409 | Konflikt (Telefonnummer bereits vergeben) |
  | 500 | Interner Serverfehler |

  ---

  ## Datenbank

  ### Relationsschema

  ```
  users ──┬── orders ──┬── order_items ──── products
           │            │
           │            └── courier_id (FK → users)
           │
  categories ──── products
  ```

  ### Tabellen

  #### `users`
  | Spalte | Typ | Einschränkung | Beschreibung |
  |--------|-----|---------------|--------------|
  | id | TEXT | PK | Feste UUID (`admin-...`, `client-...`, `livreur-...`) |
  | name | TEXT | NOT NULL | Vollständiger Name |
  | phone | TEXT | UNIQUE, NOT NULL | Telefonnummer (+237) |
  | email | TEXT | UNIQUE | E-Mail (optional) |
  | password | TEXT | NOT NULL | BCrypt-Hash |
  | role | TEXT | CHECK('client','livreur','admin') | Benutzerrolle |
  | created_at | DATETIME | DEFAULT NOW | Registrierungsdatum |

  #### `categories`
  | Spalte | Typ | Einschränkung | Beschreibung |
  |--------|-----|---------------|--------------|
  | id | INTEGER | PK AUTOINCREMENT | - |
  | name | TEXT | NOT NULL | Name (z.B. "Poulet Croustillant") |
  | slug | TEXT | UNIQUE, NOT NULL | URL-Slug (z.B. "poulet-croustillant") |
  | image | TEXT | - | Bilddateiname |
  | sort_order | INTEGER | DEFAULT 0 | Anzeigereihenfolge |

  #### `products`
  | Spalte | Typ | Einschränkung | Beschreibung |
  |--------|-----|---------------|--------------|
  | id | TEXT | PK | Feste ID (`prod-1` bis `prod-26`) |
  | category_id | INTEGER | FK → categories(id) | Kategorie |
  | name | TEXT | NOT NULL | Produktname |
  | description | TEXT | - | Beschreibung |
  | price | DECIMAL(10,2) | NOT NULL | Preis in FCFA |
  | image | TEXT | - | Bilddateiname (`/images/`) |
  | spicy_level | TEXT | CHECK('Doux','Moyen','Pimenté') | Schärfegrad |
  | available | INTEGER | DEFAULT 1 | Verfügbar zum Verkauf |
  | customization_options | TEXT | - | JSON der Anpassungsoptionen |
  | created_at | DATETIME | DEFAULT NOW | Erstellungsdatum |

  #### `orders`
  | Spalte | Typ | Einschränkung | Beschreibung |
  |--------|-----|---------------|--------------|
  | id | TEXT | PK | UUID |
  | user_id | TEXT | FK → users(id), NOT NULL | Kunde |
  | status | TEXT | CHECK(...) | `en_attente`, `payee`, `en_preparation`, `livraison`, `terminee`, `annulee` |
  | total | DECIMAL(10,2) | NOT NULL | Gesamtsumme (Produkte + Lieferung) |
  | payment_type | TEXT | CHECK('momo','cash') | Zahlungsart |
  | payment_status | TEXT | CHECK(...) | `en_attente`, `confirme`, `echoue`, `rembourse` |
  | delivery_address | TEXT | - | Lieferadresse |
  | delivery_zone | TEXT | - | Lieferzone |
  | delivery_fee | DECIMAL(10,2) | DEFAULT 0 | Liefergebühr |
  | courier_id | TEXT | FK → users(id) | Zugewiesener Lieferant |
  | notes | TEXT | - | Anweisungen für Lieferanten |
  | created_at / updated_at | DATETIME | DEFAULT NOW | Zeitstempel |

  #### `order_items`
  | Spalte | Typ | Einschränkung | Beschreibung |
  |--------|-----|---------------|--------------|
  | id | INTEGER | PK AUTOINCREMENT | - |
  | order_id | TEXT | FK → orders(id), NOT NULL | Übergeordnete Bestellung |
  | product_id | TEXT | FK → products(id), NOT NULL | Bestelltes Produkt |
  | quantity | INTEGER | DEFAULT 1 | Menge |
  | unit_price | DECIMAL(10,2) | NOT NULL | Stückpreis zum Zeitpunkt der Bestellung |
  | customization | TEXT | - | Gewählte Anpassung |

  ### Migrationsstrategie

  Das Schema wird automatisch von `database/db.js` via `CREATE TABLE IF NOT EXISTS` erstellt. Für Updates:
  1. Neue Spalten mit `ALTER TABLE` in `db.js` hinzufügen
  2. `npm run seed` erneut ausführen, um die Testdaten neu zu generieren
  3. Benutzer- und Produkt-IDs sind fest, daher bleiben JWT-Tokens und Warenkörbe gültig

  ### Anfangsdaten (Seed)

  - **3 Benutzer**: Admin, Kunde, Lieferant (feste IDs)
  - **6 Kategorien**: Poulet Croustillant, Burgers, Menus Box, Accompagnements, Boissons, Desserts
  - **26 Produkte** mit Preisen in FCFA, Schärfegraden und Anpassungsoptionen
  - **20 Lieferzonen**: Douala (6) + Yaoundé (14) mit Gebühren von 500 bis 1200 FCFA

  ### Testzugänge

  | Rolle | Telefon | Passwort |
  |-------|---------|----------|
  | Admin | 677000000 | admin123 |
  | Kunde | 699000000 | client123 |
  | Lieferant | 655000000 | livreur123 |

  ---

  ## Bereitstellung

  ### Umgebungsvariablen

  | Variable | Wo | Beschreibung |
  |----------|-----|--------------|
  | `PORT` | `backend/.env` | API-Server-Port (Standard: 5000) |
  | `JWT_SECRET` | `backend/.env` | Geheimer Schlüssel für JWT-Signatur |
  | `NODE_ENV` | `backend/.env` | Umgebung (development/production) |
  | `NEXT_PUBLIC_API_URL` | Frontend | API-URL (Standard: http://localhost:5000) |
  | `NEXT_PUBLIC_SOCKET_URL` | Frontend | Socket.IO-Server-URL (Standard: http://localhost:5000) |

  ### Produktionsverfahren

  1. **Datenbank**: `database/cfc.db` kopieren oder `npm run seed` auf dem Server ausführen
  2. **Backend**: `npm start` mit PM2 oder systemd
  3. **Frontend**: `next build` → `next start -p 3000`
  4. **Proxy**: Nginx oder Caddy für Frontend-Auslieferung + Weiterleitung von `/api/*` an das Backend
  5. **HTTPS**: SSL-Zertifikat (Let's Encrypt) für sichere Verbindungen
