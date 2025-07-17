const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db');
const sql = require('mssql');

console.log('✅ /api/reviews mounted');

router.get('/latest', async (req, res) => {
  console.log('[GET] /api/reviews/latest');
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT TOP 4 R.*, U.fullName, U.userID
      FROM tblReviews R
      JOIN tblUsers U ON R.userID = U.userID
      ORDER BY R.reviewDate DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error in /api/reviews/latest:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Lấy tất cả reviews kèm tên người dùng + tên sản phẩm
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT R.*, U.fullName, P.productName
      FROM tblReviews R
      JOIN tblUsers U ON R.userID = U.userID
      JOIN tblProducts P ON R.productID = P.productID
      ORDER BY R.reviewDate DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error in GET /api/reviews:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Xoá review
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().query(`DELETE FROM tblReviews WHERE reviewID = ${id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE /api/reviews/:id:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await poolConnect;
    const result = await pool.request()
      .input('productID', id)
      .query(`
        SELECT R.*, U.fullName 
        FROM tblReviews R 
        JOIN tblUsers U ON R.userID = U.userID 
        WHERE R.productID = @productID 
        ORDER BY R.reviewDate DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy review:', err);
    res.status(500).send('Lỗi server');
  }
});


module.exports = router;
