// ==== [backend/server.js] ====
const express = require('express');
const cors = require('cors');
const { pool, poolConnect } = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const rolesRoute = require('./routes/roles');
app.use('/api/roles', rolesRoute);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);


// DB test route
app.get('/api/test-db', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT GETDATE() as serverTime');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('DB Test Error:', err);
    res.status(500).send('Database connection failed');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});