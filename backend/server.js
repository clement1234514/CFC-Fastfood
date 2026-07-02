require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', restaurant: 'Cameroon Fried Chicken', city: 'Douala - Yaoundé' });
});

io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on('join-admin', () => {
    socket.join('admin-room');
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const dbPath = path.join(__dirname, '..', 'database', 'cfc.db');
if (!fs.existsSync(dbPath)) {
  console.log('Premier démarrage - initialisation de la base de données...');
  require('../database/seed');
}

server.listen(PORT, () => {
  console.log(`CFC API en ligne sur http://localhost:${PORT}`);
});
