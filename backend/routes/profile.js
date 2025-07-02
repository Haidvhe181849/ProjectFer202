const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { pool, poolConnect } = require('../db');

// GET thông tin người dùng
router.get('/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        await poolConnect;

        const result = await pool.request()
            .input('userID', sql.VarChar, userID)
            .query(`
        SELECT userID, fullName, username, email, phone, address
        FROM tblUsers
        WHERE userID = @userID
      `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Lỗi lấy thông tin người dùng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// PUT cập nhật thông tin người dùng
router.put('/:userID', async (req, res) => {
    const { userID } = req.params;
    const { fullName, email, phone, address } = req.body;

    try {
        await poolConnect;

        await pool.request()
            .input('userID', sql.VarChar, userID)
            .input('fullName', sql.NVarChar, fullName)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('address', sql.NVarChar, address)
            .query(`
        UPDATE tblUsers
        SET fullName = @fullName,
            email = @email,
            phone = @phone,
            address = @address
        WHERE userID = @userID
      `);

        res.json({ message: 'Cập nhật thông tin thành công' });
    } catch (err) {
        console.error('Lỗi cập nhật thông tin người dùng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// GET danh sách đơn hàng của người dùng
router.get('/orders/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        await poolConnect;

        const result = await pool.request()
            .input('userID', sql.VarChar, userID)
            .query(`
        SELECT o.orderID, o.orderDate, o.total, o.status, o.paymentMethod,
               d.detailID, d.productID, d.quantity, d.price, d.totalPrice
        FROM tblOrders o
        JOIN tblOrderDetails d ON o.orderID = d.orderID
        WHERE o.userID = @userID
        ORDER BY o.orderDate DESC
      `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi lấy đơn hàng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Cập nhật thông tin người dùng
router.put('/update-profile', async (req, res) => {
    const { userID, fullName, email, phone, address } = req.body;

    if (!userID) {
        return res.status(400).json({ message: 'Thiếu ID người dùng' });
    }

    try {
        await poolConnect;

        const result = await pool.request()
            .input('userID', sql.VarChar, userID)
            .input('fullName', sql.NVarChar, fullName)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('address', sql.NVarChar, address)
            .query(`
        UPDATE tblUsers
        SET fullName = @fullName,
            email = @email,
            phone = @phone,
            address = @address
        WHERE userID = @userID
      `);

        res.json({ message: 'Cập nhật thông tin thành công' });
    } catch (err) {
        console.error('Lỗi cập nhật profile:', err.originalError?.info || err.message);
        res.status(500).json({ message: 'Lỗi server khi cập nhật profile' });
    }
});

module.exports = router;
