const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db'); // đúng file db.js
const sql = require('mssql');

router.post('/add', async (req, res) => {
    try {
        await poolConnect;
        const { userID, productID, price, quantity } = req.body;

        const result = await pool.request()
            .input('userID', sql.VarChar, userID)
            .input('productID', sql.Int, productID)
            .input('price', sql.Decimal(10, 2), price)
            .input('quantity', sql.Int, quantity)
            .query(`
        IF EXISTS (
          SELECT 1 FROM tblCart WHERE userID = @userID AND productID = @productID
        )
          UPDATE tblCart 
          SET quantity = quantity + @quantity
          WHERE userID = @userID AND productID = @productID
        ELSE
          INSERT INTO tblCart (userID, productID, price, quantity)
          VALUES (@userID, @productID, @price, @quantity)
      `);

        res.status(200).json({ message: '✔️ Thêm vào giỏ hàng thành công' });
    } catch (err) {
        console.error('❌ Lỗi add to cart:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/count', async (req, res) => {
    try {
        await poolConnect;
        const { userID } = req.query;

        const result = await pool.request()
            .input('userID', sql.VarChar, userID)
            .query(`
        SELECT SUM(quantity) AS totalItems
        FROM tblCart
        WHERE userID = @userID
      `);

        const totalItems = result.recordset[0].totalItems || 0;
        res.json({ totalItems });
    } catch (err) {
        console.error('Lỗi lấy số lượng giỏ hàng:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Cập nhật số lượng trong giỏ hàng
router.put('/update', async (req, res) => {
    try {
        await poolConnect;
        const { userID, productID, quantity } = req.body;

        await pool.request()
            .input('userID', sql.VarChar, userID)
            .input('productID', sql.Int, productID)
            .input('quantity', sql.Int, quantity)
            .query(`
        UPDATE tblCart
        SET quantity = @quantity
        WHERE userID = @userID AND productID = @productID
      `);

        res.json({ message: 'Cập nhật số lượng thành công' });
    } catch (err) {
        console.error('Lỗi khi cập nhật giỏ hàng:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Xoá sản phẩm khỏi giỏ hàng
router.delete('/delete', async (req, res) => {
    try {
        await poolConnect;
        const { userID, productID } = req.body;

        await pool.request()
            .input('userID', sql.VarChar, userID)
            .input('productID', sql.Int, productID)
            .query(`
        DELETE FROM tblCart
        WHERE userID = @userID AND productID = @productID
      `);

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (err) {
        console.error('Lỗi khi xoá sản phẩm:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/user/:userID', async (req, res) => {
    try {
        await poolConnect;
        const { userID } = req.params;

        const result = await pool.request()
            .input('userID', sql.VarChar, userID)
            .query(`
        SELECT c.productID, c.quantity, c.price, p.productName, p.image
        FROM tblCart c
        JOIN tblProducts p ON c.productID = p.productID
        WHERE c.userID = @userID
      `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách giỏ hàng:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
