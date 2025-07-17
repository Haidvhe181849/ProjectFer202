// components/HeaderManagement.js
import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeaderManagement = ({ user, onLogout, cartCount = 0, activePath = '/role-management' }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formPassword, setFormPassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const menu = [
    { name: 'Home', path: '/' },
    { name: 'Category Management', path: '/category-management' },
    { name: 'Role Management', path: '/role-management' },
    { name: 'Account Management', path: '/account-management' },
    { name: 'Product Management', path: '/product-management' },
    { name: 'Review Management', path: '/review-management' }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formPassword.newPassword !== formPassword.confirmPassword) {
      setError('Mật khẩu mới không trùng khớp.');
      return;
    }

    try {
      await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: user.userID,
          oldPassword: formPassword.oldPassword,
          newPassword: formPassword.newPassword
        })
      });

      setSuccess('Đổi mật khẩu thành công!');
      setFormPassword({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      setError('Mật khẩu cũ không đúng hoặc có lỗi xảy ra.');
    }
  };

  return (
    <>
      <header className="bg-[#fdfaf4] py-4 px-6 md:px-12 shadow-sm flex justify-between items-center">
        <div className="text-xl font-extrabold tracking-wide text-black flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>🌿 BRAND.</div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-800">
          {menu.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`hover:text-rose-500 ${item.path === activePath ? 'text-rose-600 font-semibold' : ''}`}
            >
              {item.name.replace(' Management', '')}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-4 relative">
          <span className="text-sm hidden md:inline-block">Xin chào, {user.fullName}</span>
          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
          <div className="relative" ref={dropdownRef}>
            <img
              src={`https://i.pravatar.cc/150?u=${user?.userID || 'guest'}`}
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-white shadow cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <a
                  href="/category-management"
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý sản phẩm
                </a>
                <button
                  onClick={() => { setShowModal(true); setOpenMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Đổi mật khẩu
                </button>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500 font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

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
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-500">
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderManagement;