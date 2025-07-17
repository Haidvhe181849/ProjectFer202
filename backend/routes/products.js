const express = require('express');
const router = express.Router();
const { poolConnect, pool } = require('../db');
const multer = require('multer');
const path = require('path');

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Lấy tất cả sản phẩm
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

// Lấy sản phẩm bán chạy nhất
router.get('/best-seller', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
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

// Thêm sản phẩm có upload ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    await poolConnect;

    const { productName, price, quantity, categoryID, importDate, usingDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg';

    await pool.request()
      .input('productName', productName)
      .input('image', image)
      .input('price', parseFloat(price))
      .input('quantity', parseInt(quantity))
      .input('categoryID', categoryID)
      .input('importDate', new Date(importDate))
      .input('usingDate', new Date(usingDate))
      .input('sold', 0)
      .input('status', 1)
      .query(`
        INSERT INTO tblProducts 
        (productName, image, price, quantity, categoryID, importDate, usingDate, sold, status)
        VALUES 
        (@productName, @image, @price, @quantity, @categoryID, @importDate, @usingDate, @sold, @status)
      `);

    res.json({ message: 'Thêm sản phẩm thành công!' });
  } catch (err) {
    console.error('Lỗi khi thêm sản phẩm:', err);
    res.status(500).send('Thêm sản phẩm thất bại');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await poolConnect;
    const { id } = req.params;
    await pool.request()
      .input('productID', id)
      .query('DELETE FROM tblProducts WHERE productID = @productID');
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    console.error('Lỗi khi xoá sản phẩm:', err);
    res.status(500).send('Xoá thất bại');
  }
});

module.exports = router;
