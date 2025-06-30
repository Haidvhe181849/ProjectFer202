// 📁 routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const { pool, poolConnect } = require('../db');
require('dotenv').config();

// Đăng nhập
router.post('/login', async (req, res) => {
  const { identity, password } = req.body;
  console.log('Đăng nhập với:', identity, password);

  try {
    await poolConnect;

    const result = await pool.request()
      .input('identity', sql.NVarChar, identity.trim())
      .query(`
        SELECT userID, fullName, roleID, password
        FROM tblUsers
        WHERE (LOWER(username) = LOWER(@identity) OR LOWER(email) = LOWER(@identity))
          AND activate = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Sai thông tin đăng nhập' });
    }

    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Sai thông tin đăng nhập' });
    }

    const token = jwt.sign(
      { userID: user.userID, roleID: user.roleID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err.originalError?.info || err.message || err);
    res.status(500).send('Lỗi server');
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  const { fullName, username, email, password, address, phone } = req.body;

  try {
    await poolConnect;

    // Kiểm tra email đã tồn tại
    const checkEmail = await pool.request()
      .input('email', sql.NVarChar, email.trim())
      .query('SELECT * FROM tblUsers WHERE email = @email');

    if (checkEmail.recordset.length > 0) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    // Kiểm tra username đã tồn tại
    const checkUsername = await pool.request()
      .input('username', sql.NVarChar, username.trim())
      .query('SELECT * FROM tblUsers WHERE username = @username');

    if (checkUsername.recordset.length > 0) {
      return res.status(409).json({ message: 'Username đã tồn tại' });
    }

    // Tạo userID ngẫu nhiên
    const userID = 'u' + Date.now();

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user mới
    await pool.request()
      .input('userID', sql.VarChar, userID)
      .input('fullName', sql.NVarChar, fullName.trim())
      .input('username', sql.NVarChar, username.trim())
      .input('password', sql.NVarChar, hashedPassword)
      .input('roleID', sql.Int, 1)
      .input('address', sql.NVarChar, address || '')
      .input('phone', sql.VarChar, phone || '')
      .input('email', sql.NVarChar, email.trim())
      .query(`
        INSERT INTO tblUsers (userID, fullName, username, password, roleID, address, phone, email)
        VALUES (@userID, @fullName, @username, @password, @roleID, @address, @phone, @email)
      `);

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error('Lỗi đăng ký:', err.originalError?.info || err);
    res.status(500).json({ message: 'Đăng ký thất bại' });
  }
});

// Đổi mật khẩu
router.post('/change-password', async (req, res) => {
  const { userID, oldPassword, newPassword } = req.body;

  if (!userID || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Thiếu thông tin yêu cầu.' });
  }

  try {
    await poolConnect;

    // Lấy mật khẩu hiện tại
    const result = await pool.request()
      .input('userID', sql.VarChar, userID)
      .query('SELECT password FROM tblUsers WHERE userID = @userID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const hashedPassword = result.recordset[0].password;
    const match = await bcrypt.compare(oldPassword, hashedPassword);

    if (!match) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' });
    }

    // Hash mật khẩu mới
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await pool.request()
      .input('userID', sql.VarChar, userID)
      .input('password', sql.NVarChar, newHashedPassword)
      .query('UPDATE tblUsers SET password = @password WHERE userID = @userID');

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('Lỗi đổi mật khẩu:', err.originalError?.info || err.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi server' });
  }
});


router.post('/reset-password', async (req, res) => {
  const { email, phone, username, newPassword } = req.body;

  if (!email || !phone || !username || !newPassword) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('username', sql.NVarChar, username)
      .query(`
        SELECT userID FROM tblUsers
        WHERE LOWER(email) = LOWER(@email)
          AND phone = @phone
          AND LOWER(username) = LOWER(@username)
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Thông tin không khớp với bất kỳ tài khoản nào' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.request()
      .input('userID', sql.VarChar, result.recordset[0].userID)
      .input('password', sql.NVarChar, hashed)
      .query('UPDATE tblUsers SET password = @password WHERE userID = @userID');

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    console.error('Lỗi reset mật khẩu:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});


module.exports = router;
