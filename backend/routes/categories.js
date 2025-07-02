const express = require('express');
const router = express.Router();
const { poolConnect, pool } = require('../db');

// GET all categories
router.get('/', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query(`
  SELECT 
    categoryID AS categoryID, 
    categoryName AS categoryName, 
    describe AS describe 
  FROM tblCategories
`);

        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi lấy categories:', err);
        res.status(500).send('Server Error');
    }
});

// POST new category
router.post('/', async (req, res) => {
    try {
        await poolConnect;
        const { categoryID, categoryName, describe } = req.body;

        await pool.request()
            .input('categoryID', categoryID)
            .input('categoryName', categoryName)
            .input('describe', describe)
            .query(`INSERT INTO tblCategories (categoryID, categoryName, describe) 
              VALUES (@categoryID, @categoryName, @describe)`);

        res.json({ message: 'Thêm category thành công' });
    } catch (err) {
        console.error('Lỗi thêm category:', err);
        res.status(500).send('Thêm category thất bại');
    }
});

// update category
const sql = require('mssql');

router.put('/:id', async (req, res) => {
    try {
        await poolConnect;

        const { id } = req.params;
        const { categoryName, describe } = req.body;

        if (!categoryName) {
            return res.status(400).json({ message: 'Tên danh mục không được để trống' });
        }

        console.log("🔄 Đang cập nhật category:", id, categoryName, describe);

        const result = await pool.request()
            .input('categoryID', sql.VarChar, id)
            .input('categoryName', sql.NVarChar, categoryName)
            .input('describe', sql.NVarChar, describe || '')
            .query(`
        UPDATE tblCategories
        SET categoryName = @categoryName, describe = @describe
        WHERE categoryID = @categoryID
      `);

        console.log("✅ rowsAffected:", result.rowsAffected);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy category để cập nhật' });
        }

        res.json({ message: '✔️ Cập nhật thành công' });
    } catch (err) {
        console.error("❌ Lỗi cập nhật:", err);
        res.status(500).json({ message: 'Lỗi server khi cập nhật' });
    }
});




// DELETE category
router.delete('/:id', async (req, res) => {
    try {
        await poolConnect;
        const { id } = req.params;

        await pool.request()
            .input('categoryID', id)
            .query('DELETE FROM tblCategories WHERE categoryID = @categoryID');

        res.json({ message: 'Xoá category thành công' });
    } catch (err) {
        console.error('Lỗi xoá category:', err);
        res.status(500).send('Xoá category thất bại');
    }
});

module.exports = router;
