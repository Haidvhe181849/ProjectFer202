// ==== [backend/routes/roles.js] ====
const express = require('express');
const router = express.Router();
const { poolConnect, pool } = require('../db');

// Get all roles
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM tblRoles ORDER BY roleID');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách roles:', err);
    res.status(500).send('Server error');
  }
});

// Add a new role
router.post('/', async (req, res) => {
  try {
    await poolConnect;
    const { roleName } = req.body;

    await pool.request()
      .input('roleName', roleName)
      .query('INSERT INTO tblRoles (roleName) VALUES (@roleName)');

    res.json({ message: 'Thêm vai trò thành công' });
  } catch (err) {
    console.error('Lỗi khi thêm role:', err);
    res.status(500).send('Thêm role thất bại');
  }
});

// Update a role
router.put('/:id', async (req, res) => {
  try {
    await poolConnect;
    const { id } = req.params;
    const { roleName } = req.body;

    const result = await pool.request()
      .input('roleID', id)
      .input('roleName', roleName)
      .query('UPDATE tblRoles SET roleName = @roleName WHERE roleID = @roleID');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Không tìm thấy role để cập nhật' });
    }

    res.json({ message: 'Cập nhật vai trò thành công' });
  } catch (err) {
    console.error('Lỗi khi cập nhật role:', err);
    res.status(500).send('Cập nhật role thất bại');
  }
});

// Delete a role
router.delete('/:id', async (req, res) => {
  try {
    await poolConnect;
    const { id } = req.params;

    await pool.request()
      .input('roleID', id)
      .query('DELETE FROM tblRoles WHERE roleID = @roleID');

    res.json({ message: 'Xoá role thành công' });
  } catch (err) {
    console.error('Lỗi khi xoá role:', err);
    res.status(500).send('Xoá role thất bại');
  }
});

module.exports = router;