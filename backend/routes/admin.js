const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(auth, adminOnly);

router.get('/orders', (req, res) => {
  const { status } = req.query;
  let orders;
  if (status) {
    orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.phone as user_phone
      FROM orders o JOIN users u ON o.user_id = u.id
      WHERE o.status = ? ORDER BY o.created_at DESC
    `).all(status);
  } else {
    orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.phone as user_phone
      FROM orders o JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `).all();
  }
  for (const order of orders) {
    order.items = db.prepare(`
      SELECT oi.*, p.name as product_name, p.image
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
  }
  res.json(orders);
});

router.put('/orders/:id/status', (req, res) => {
  const { status, courier_id } = req.body;
  const validStatuses = ['en_attente', 'payee', 'en_preparation', 'livraison', 'terminee', 'annulee'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });

  db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, req.params.id);

  if (courier_id) {
    db.prepare('UPDATE orders SET courier_id = ? WHERE id = ?').run(courier_id, req.params.id);
  }

  const updatedOrder = db.prepare(`
    SELECT o.*, u.name as user_name, u.phone as user_phone
    FROM orders o JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `).get(req.params.id);

  updatedOrder.items = db.prepare(`
    SELECT oi.*, p.name as product_name, p.image
    FROM order_items oi JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).all(req.params.id);

  if (req.io) {
    req.io.to(`order-${req.params.id}`).emit('order-update', updatedOrder);
    req.io.to('admin-room').emit('order-status-changed', { order_id: req.params.id, status });
  }

  res.json(updatedOrder);
});

router.get('/products', (req, res) => {
  const products = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p JOIN categories c ON p.category_id = c.id
    ORDER BY c.sort_order, p.name
  `).all();
  res.json(products.map(p => ({
    ...p,
    customization_options: p.customization_options ? JSON.parse(p.customization_options) : null
  })));
});

router.post('/products', (req, res) => {
  const { name, description, price, category_id, image, spicy_level, customization_options } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: 'Nom, prix et catégorie requis' });
  }
  const id = uuidv4();
  db.prepare(`
    INSERT INTO products (id, category_id, name, description, price, image, spicy_level, customization_options)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, category_id, name, description || '', price, image || null, spicy_level || 'Doux',
    customization_options ? JSON.stringify(customization_options) : null);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.status(201).json(product);
});

router.put('/products/:id', (req, res) => {
  const { name, description, price, category_id, image, spicy_level, available, customization_options } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });

  db.prepare(`
    UPDATE products SET name=?, description=?, price=?, category_id=?, image=?,
    spicy_level=?, available=?, customization_options=?
    WHERE id=?
  `).run(
    name || product.name,
    description !== undefined ? description : product.description,
    price || product.price,
    category_id || product.category_id,
    image !== undefined ? image : product.image,
    spicy_level || product.spicy_level,
    available !== undefined ? (available ? 1 : 0) : product.available,
    customization_options ? JSON.stringify(customization_options) : product.customization_options,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.get('/couriers', (req, res) => {
  const couriers = db.prepare('SELECT id, name, phone FROM users WHERE role = ?').all('livreur');
  res.json(couriers);
});

router.get('/stats', (req, res) => {
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  const totalRevenue = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != ?').get('annulee');
  const ordersToday = db.prepare("SELECT COUNT(*) as count FROM orders WHERE date(created_at) = date('now')").get();
  const revenueToday = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE date(created_at) = date('now') AND status != ?").get('annulee');
  const byStatus = db.prepare("SELECT status, COUNT(*) as count FROM orders GROUP BY status").all();
  const recentOrders = db.prepare(`
    SELECT o.*, u.name as user_name FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC LIMIT 5
  `).all();

  res.json({
    totalOrders: totalOrders.count,
    totalRevenue: totalRevenue.total,
    ordersToday: ordersToday.count,
    revenueToday: revenueToday.total,
    byStatus,
    recentOrders
  });
});

module.exports = router;
