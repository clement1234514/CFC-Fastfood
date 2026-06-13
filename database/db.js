const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'cfc.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client' CHECK(role IN ('client','livreur','admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    spicy_level TEXT DEFAULT 'Doux' CHECK(spicy_level IN ('Doux','Moyen','Pimenté')),
    available INTEGER DEFAULT 1,
    customization_options TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'en_attente' CHECK(status IN ('en_attente','payee','en_preparation','livraison','terminee','annulee')),
    total DECIMAL(10,2) NOT NULL,
    payment_type TEXT CHECK(payment_type IN ('momo','cash')),
    payment_status TEXT DEFAULT 'en_attente' CHECK(payment_status IN ('en_attente','confirme','echoue','rembourse')),
    delivery_address TEXT,
    delivery_zone TEXT,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    delivery_lat DECIMAL(10,7),
    delivery_lng DECIMAL(10,7),
    courier_id TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (courier_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    customization TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

module.exports = db;
