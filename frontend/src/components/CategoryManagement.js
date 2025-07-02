// ==== [frontend/CategoryManagement.js] ====
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import HeaderManagement from './HeaderManagement';

const CategoryManagement = ({ user = { userID: 'admin', fullName: 'Admin' }, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [form, setForm] = useState({ categoryID: '', categoryName: '', describe: '' });
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState(0);
  const [editing, setEditing] = useState(false);
  const [notification, setNotification] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formPassword, setFormPassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const generateNextID = (data) => {
    const maxID = data.reduce((max, item) => {
      const num = parseInt(item.categoryID.replace(/\D/g, ''));
      return num > max ? num : max;
    }, 0);
    return `C${(maxID + 1).toString().padStart(3, '0')}`;
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
      setOriginalCategories(res.data);
      if (!editing) {
        const nextID = generateNextID(res.data);
        setForm(prev => ({ ...prev, categoryID: nextID }));
      }
    } catch (err) {
      console.error('❌ Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = async () => {
    try {
      if (!form.categoryID || !form.categoryName) {
        alert('Vui lòng nhập đầy đủ Category ID và Name.');
        return;
      }

      if (editing) {
        const res = await axios.put(`http://localhost:5000/api/categories/${form.categoryID}`, {
          categoryName: form.categoryName,
          describe: form.describe
        });
        setNotification(res.data.message || '✔️ Cập nhật thành công');
      } else {
        await axios.post('http://localhost:5000/api/categories', form);
        setNotification('✔️ Thêm category thành công');
      }

      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
      setOriginalCategories(res.data);

      const nextID = generateNextID(res.data);
      setForm({ categoryID: nextID, categoryName: '', describe: '' });
      setEditing(false);

      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('❌ Lỗi xử lý:', err.response?.data || err.message || err);
      setNotification('❌ Lỗi khi xử lý category');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá category này không?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setNotification('🗑️ Xoá category thành công');
      fetchCategories();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  const handleSort = () => {
    let sorted;
    if (sortMode === 0) {
      sorted = [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName));
      setSortMode(1);
    } else if (sortMode === 1) {
      sorted = [...categories].sort((a, b) => b.categoryName.localeCompare(a.categoryName));
      setSortMode(2);
    } else {
      sorted = [...originalCategories];
      setSortMode(0);
    }
    setCategories(sorted);
  };

  const handleResetSearch = () => {
    setSearch('');
    setCategories(originalCategories);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formPassword.newPassword !== formPassword.confirmPassword) {
      setError('Mật khẩu mới không trùng khớp.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/change-password', {
        userID: user.userID,
        oldPassword: formPassword.oldPassword,
        newPassword: formPassword.newPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setFormPassword({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      setError('Mật khẩu cũ không đúng hoặc có lỗi xảy ra.');
    }
  };

  const filteredCategories = categories.filter(c =>
    c.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  const menu = [
    { name: 'Home', path: '/' },
    { name: 'Category Management', path: '/category-management' },
    { name: 'Role Management', path: '/role-management' },
    { name: 'Account Management', path: '/account-management' },
    { name: 'Product Management', path: '/product-management' }
  ];

  return (
    <div className="min-h-screen bg-[#fffafc]">
      <HeaderManagement user={user} onLogout={onLogout} cartCount={0} activePath="/category-management" />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input type="password" placeholder="Mật khẩu cũ" className="w-full border px-4 py-2 rounded" value={formPassword.oldPassword} onChange={(e) => setFormPassword({ ...formPassword, oldPassword: e.target.value })} required />
              <input type="password" placeholder="Mật khẩu mới" className="w-full border px-4 py-2 rounded" value={formPassword.newPassword} onChange={(e) => setFormPassword({ ...formPassword, newPassword: e.target.value })} required />
              <input type="password" placeholder="Nhập lại mật khẩu mới" className="w-full border px-4 py-2 rounded" value={formPassword.confirmPassword} onChange={(e) => setFormPassword({ ...formPassword, confirmPassword: e.target.value })} required />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-500">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-700">Category Management</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 border rounded" />
            <button onClick={handleResetSearch} className="bg-gray-100 px-3 py-2 rounded text-sm">All</button>
            <button onClick={handleSort} className="bg-gray-200 px-3 py-2 rounded text-sm">Sort {sortMode === 1 ? '↑' : sortMode === 2 ? '↓' : ''}</button>
          </div>
        </div>

        {notification && <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{notification}</div>}

        <div className="mb-4 bg-white p-4 rounded shadow space-y-3">
          <h3 className="text-lg font-semibold mb-2">{editing ? 'Edit Category' : 'Add New Category'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input readOnly type="text" placeholder="Category ID" className="border p-2 rounded" value={form.categoryID} />
            <input type="text" placeholder="Category Name" className="border p-2 rounded" value={form.categoryName} onChange={e => setForm({ ...form, categoryName: e.target.value })} />
            <input type="text" placeholder="Description" className="border p-2 rounded col-span-2" value={form.describe} onChange={e => setForm({ ...form, describe: e.target.value })} />
          </div>
          <button onClick={handleAdd} className="mt-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-500 transition">{editing ? 'Update Category' : 'Add Category'}</button>
        </div>

        <div className="bg-white rounded shadow p-4 overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.categoryID} className="border-b hover:bg-pink-50">
                  <td className="p-2">{category.categoryID}</td>
                  <td className="p-2">{category.categoryName || category.categoryname}</td>
                  <td className="p-2">{category.describe}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(category)} className="text-sm px-3 py-1 border rounded hover:bg-yellow-100">Edit</button>
                    <button onClick={() => handleDelete(category.categoryID)} className="text-sm px-3 py-1 border text-red-600 hover:bg-red-100 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CategoryManagement;
