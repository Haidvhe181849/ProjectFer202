import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import axios from 'axios';

const Header = ({ user, onLogout }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu mới không trùng khớp.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/change-password', {
        userID: user.userID,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      setError('Mật khẩu cũ không đúng hoặc có lỗi xảy ra.');
    }
  };

  return (
    <>
      <header className="bg-[#fdfaf4] py-4 px-6 md:px-12 shadow-sm flex justify-between items-center">
        <div className="text-xl font-extrabold tracking-wide text-black flex items-center gap-1">
          <span>🌿</span> BRAND.
        </div>

        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-800">
          <a href="#" className="hover:text-rose-500">Home</a>
          <a href="#" className="hover:text-rose-500">Category</a>
          <a href="#" className="hover:text-rose-500">Best Sellers</a>
          <a href="#" className="hover:text-rose-500">Reviews</a>
          <a href="#" className="hover:text-rose-500">About</a>
        </nav>

        <div className="flex items-center space-x-4 relative">
          <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 shadow-inner">
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm bg-transparent w-32 md:w-40"
            />
          </div>

          {user && (
            <span className="text-sm hidden md:inline-block">Xin chào, {user.fullName}</span>
          )}

          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <img
              src={`https://i.pravatar.cc/150?u=${user?.userID || "guest"}`}
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-white shadow cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
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

      {/* Modal đổi mật khẩu */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                placeholder="Mật khẩu cũ"
                className="w-full border px-4 py-2 rounded"
                value={form.oldPassword}
                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                className="w-full border px-4 py-2 rounded"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="w-full border px-4 py-2 rounded"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-500"
                >
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

export default Header;
