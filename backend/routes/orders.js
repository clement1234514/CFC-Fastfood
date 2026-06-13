const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

const DELIVERY_ZONES = {
  'Bonapriso': 500, 'Akwa': 500, 'Bonanjo': 500, 'Deido': 800,
  'Logbessou': 1000, 'Makepe': 800, 'Douala 3': 1000, 'Bastos': 800,
  'Essos': 800, 'Ngoa-Ekelle': 500, 'Mvog-Mbi': 800, 'Emana': 1200,
  'Biyem-Assi': 800, 'Melen': 500, 'Obili': 800, 'Etoa-Meki': 500,
  'Mokolo': 500, 'Nkolbisson': 1200, 'Nsam': 500, 'Mimboman': 1000
};

router.get('/zones', (req, res) => {
  res.json(DELIVERY_ZONES);
});

router.post('/', auth, (req, res) => {
  const { items, delivery_address, delivery_zone, delivery_lat, delivery_lng, payment_type, notes } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Panier vide' });
  }
  if (!delivery_zone) {
    return res.status(400).json({ error: 'Zone de livraison requise' });
  }

  const delivery_fee = DELIVERY_ZONES[delivery_zone] || 1000;

  const productIds = items.map(i => i.product_id);
  const placeholders = productIds.map(() => '?').join(',');
  const productRows = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...productIds);
  const productMap = {};
  for (const p of productRows) productMap[p.id] = p;

  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = productMap[item.product_id];
    if (!product) return res.status(400).json({ error: `Produit ${item.product_id} introuvable` });
    if (!product.available) return res.status(400).json({ error: `${product.name} n'est plus disponible` });
    const unit_price = product.price;
    total += unit_price * item.quantity;
    orderItems.push({ product_id: item.product_id, quantity: item.quantity, unit_price, customization: item.customization || null });
  }

  const orderId = uuidv4();
  total += delivery_fee;

  try {
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, user_id, status, total, payment_type, payment_status, delivery_address, delivery_zone, delivery_fee, delivery_lat, delivery_lng, notes)
      VALUES (?, ?, 'en_attente', ?, ?, 'en_attente', ?, ?, ?, ?, ?, ?)
    `);
    insertOrder.run(orderId, req.user.id, total, payment_type || 'cash',
      delivery_address || null, delivery_zone, delivery_fee,
      delivery_lat || null, delivery_lng || null, notes || null);

    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, unit_price, customization) VALUES (?, ?, ?, ?, ?)');
    for (const item of orderItems) {
      insertItem.run(orderId, item.product_id, item.quantity, item.unit_price, item.customization);
    }
  } catch (err) {
    return res.status(400).json({ error: 'Erreur lors de la création de la commande. Essayez de vous reconnecter et de ré-ajouter les articles au panier.' });
  }

  const order = db.prepare(`
    SELECT o.*, u.name as user_name, u.phone as user_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `).get(orderId);

  const itemsDetail = db.prepare(`
    SELECT oi.*, p.name as product_name, p.image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).all(orderId);

  order.items = itemsDetail;

  if (req.io) {
    req.io.to('admin-room').emit('new-order', order);
    req.io.to(`order-${orderId}`).emit('order-update', order);
  }

  res.status(201).json(order);
});

router.get('/', auth, (req, res) => {
  let orders;
  if (req.user.role === 'admin' || req.user.role === 'livreur') {
    orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.phone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `).all();
  } else {
    orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.phone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id);
  }

  for (const order of orders) {
    order.items = db.prepare(`
      SELECT oi.*, p.name as product_name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
  }

  res.json(orders);
});

router.get('/:id', auth, (req, res) => {
  const order = db.prepare(`
    SELECT o.*, u.name as user_name, u.phone as user_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `).get(req.params.id);

  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  if (order.user_id !== req.user.id && req.user.role === 'client') {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  order.items = db.prepare(`
    SELECT oi.*, p.name as product_name, p.image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).all(order.id);

  res.json(order);
});

module.exports = router;
