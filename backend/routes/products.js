const express = require('express');
const db = require('../../database/db');
const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  let products;
  if (category) {
    products = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ? AND p.available = 1
      ORDER BY c.sort_order, p.name
    `).all(category);
  } else {
    products = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.available = 1
      ORDER BY c.sort_order, p.name
    `).all();
  }
  products = products.map(p => ({
    ...p,
    customization_options: p.customization_options ? JSON.parse(p.customization_options) : null
  }));
  res.json(products);
});

router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order').all();
  res.json(categories);
});

router.get('/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  product.customization_options = product.customization_options ? JSON.parse(product.customization_options) : null;
  res.json(product);
});

module.exports = router;
