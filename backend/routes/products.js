const express = require('express');
const router = express.Router();
const { poolConnect, pool } = require('../db');

// GET /api/products

// Lấy toàn bộ sản phẩm
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM tblProducts WHERE status = 1');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm:', err);
    res.status(500).send('Lỗi server');
  }
});

// GET /api/products/best-seller
router.get('/best-seller', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .query(`
        SELECT TOP 1 * FROM tblProducts
        WHERE status = 1
        ORDER BY sold DESC
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm bán chạy nhất:', err);
    res.status(500).send('Lỗi server');
  }
});


module.exports = router;
