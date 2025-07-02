// ==== [frontend/RoleManagement.js] ====
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import HeaderManagement from './HeaderManagement';

const RoleManagement = ({ user = { userID: 'admin', fullName: 'Admin' }, onLogout }) => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ roleID: '', roleName: '' });
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formPassword, setFormPassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/roles');
      setRoles(res.data);
      if (!editingId) {
        const maxID = res.data.reduce((max, item) => (item.roleID > max ? item.roleID : max), 0);
        setForm(prev => ({ ...prev, roleID: maxID + 1 }));
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
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

  const handleAddOrUpdate = async () => {
    try {
      if (!form.roleName) return alert('Vui lòng nhập tên vai trò');

      if (editingId !== null) {
        await axios.put(`http://localhost:5000/api/roles/${editingId}`, { roleName: form.roleName });
        setNotification('✔️ Cập nhật thành công');
      } else {
        await axios.post('http://localhost:5000/api/roles', { roleName: form.roleName });
        setNotification('✔️ Thêm role thành công');
      }

      setForm({ roleID: '', roleName: '' });
      setEditingId(null);
      fetchRoles();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Lỗi xử lý:', err);
      setNotification('❌ Lỗi khi xử lý role');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleEdit = (role) => {
    setForm({ roleID: role.roleID, roleName: role.roleName });
    setEditingId(role.roleID);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá role này không?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/roles/${id}`);
      setNotification('🗑️ Xoá role thành công');
      fetchRoles();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSort = () => {
    const sorted = [...roles];
    sorted.sort((a, b) => {
      const compare = a.roleName.localeCompare(b.roleName);
      return sortMode === 1 ? -compare : compare;
    });
    setRoles(sorted);
    setSortMode((sortMode + 1) % 3);
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

  const filtered = roles.filter(r =>
    r.roleName.toLowerCase().includes(search.toLowerCase())
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
      <HeaderManagement user={user} onLogout={onLogout} cartCount={0} activePath="/role-management"s />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                placeholder="Mật khẩu cũ"
                className="w-full border px-4 py-2 rounded"
                value={formPassword.oldPassword}
                onChange={(e) => setFormPassword({ ...formPassword, oldPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                className="w-full border px-4 py-2 rounded"
                value={formPassword.newPassword}
                onChange={(e) => setFormPassword({ ...formPassword, newPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="w-full border px-4 py-2 rounded"
                value={formPassword.confirmPassword}
                onChange={(e) => setFormPassword({ ...formPassword, confirmPassword: e.target.value })}
                required
              />
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
          <h2 className="text-2xl font-bold text-pink-700">Role Management</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 border rounded" />
            <button onClick={handleSort} className="bg-gray-200 px-3 py-2 rounded text-sm">
              Sort {sortMode === 1 ? '↑' : sortMode === 2 ? '↓' : ''}
            </button>
          </div>
        </div>

        {notification && <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{notification}</div>}

        <div className="mb-4 bg-white p-4 rounded shadow space-y-3">
          <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Role' : 'Add New Role'}</h3>
          <input type="text" placeholder="Role Name" className="border p-2 rounded w-full" value={form.roleName} onChange={e => setForm({ ...form, roleName: e.target.value })} />
          <button onClick={handleAddOrUpdate} className="mt-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-500 transition">
            {editingId ? 'Update Role' : 'Add Role'}
          </button>
        </div>

        <div className="bg-white rounded shadow p-4 overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Role Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(role => (
                <tr key={role.roleID} className="border-b hover:bg-pink-50">
                  <td className="p-2">{role.roleID}</td>
                  <td className="p-2">{role.roleName}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(role)} className="text-sm px-3 py-1 border rounded hover:bg-yellow-100">Edit</button>
                    <button onClick={() => handleDelete(role.roleID)} className="text-sm px-3 py-1 border text-red-600 hover:bg-red-100 rounded">Delete</button>
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

export default RoleManagement;
