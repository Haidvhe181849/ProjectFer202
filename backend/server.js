const express = require('express');
const cors = require('cors');
const { pool, poolConnect } = require('./db');
require('dotenv').config();

const app = express();

// Bật CORS trước các route
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);





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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
