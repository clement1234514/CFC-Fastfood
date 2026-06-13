const express = require('express');
const db = require('../../database/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/initiate', auth, (req, res) => {
  const { order_id, payment_method } = req.body;
  if (!order_id) return res.status(400).json({ error: 'ID de commande requis' });

  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(order_id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  if (order.payment_status === 'confirme') return res.status(400).json({ error: 'Déjà payée' });

  if (payment_method === 'momo') {
    db.prepare('UPDATE orders SET payment_type = ?, payment_status = ? WHERE id = ?')
      .run('momo', 'en_attente', order_id);

    const paymentPayload = {
      order_id,
      amount: order.total,
      phone: req.user.phone,
      description: `CFC Commande #${order_id.slice(0, 8)}`,
      api_key: 'demo_key_cfc',
    };

    setTimeout(() => {
      db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run('confirme', order_id);
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('payee', order_id);
      const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id);
      if (req.io) {
        req.io.to(`order-${order_id}`).emit('order-update', updatedOrder);
        req.io.to('admin-room').emit('order-paid', { order_id, status: 'confirme' });
      }
    }, 3000);

    res.json({
      success: true,
      message: 'Paiement Mobile Money initié. Confirmation dans quelques instants...',
      payment: paymentPayload,
      redirect_url: null
    });
  } else {
    db.prepare('UPDATE orders SET payment_type = ?, payment_status = ? WHERE id = ?')
      .run('cash', 'en_attente', order_id);
    res.json({ success: true, message: 'Paiement à la livraison sélectionné', payment_type: 'cash' });
  }
});

router.post('/confirm', auth, (req, res) => {
  const { order_id, transaction_id } = req.body;
  if (!order_id) return res.status(400).json({ error: 'ID de commande requis' });

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });

  db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run('confirme', order_id);
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('payee', order_id);

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id);
  if (req.io) {
    req.io.to(`order-${order_id}`).emit('order-update', updatedOrder);
    req.io.to('admin-room').emit('order-paid', { order_id, status: 'confirme', transaction_id });
  }

  res.json({ success: true, message: 'Paiement confirmé', order: updatedOrder });
});

router.get('/methods', (req, res) => {
  res.json({
    methods: [
      { id: 'momo', name: 'Mobile Money', providers: ['MTN Mobile Money', 'Orange Money'], icon: 'smartphone' },
      { id: 'cash', name: 'Paiement à la livraison', description: 'Espèces acceptées à la livraison', icon: 'cash' }
    ]
  });
});

module.exports = router;
