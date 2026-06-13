const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');
const router = express.Router();

router.post('/register', (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Nom, téléphone et mot de passe requis' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    return res.status(409).json({ error: 'Ce numéro est déjà utilisé' });
  }
  const id = uuidv4();
  const hashed = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, name, phone, email || null, hashed, 'client');
  const token = jwt.sign({ id, name, phone, role: 'client' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id, name, phone, email, role: 'client' } });
});

router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Téléphone et mot de passe requis' });
  }
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Numéro ou mot de passe incorrect' });
  }
  const token = jwt.sign(
    { id: user.id, name: user.name, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role } });
});

router.get('/me', require('../middleware/auth').auth, (req, res) => {
  const user = db.prepare('SELECT id, name, phone, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(user);
});

module.exports = router;
