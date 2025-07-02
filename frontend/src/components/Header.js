// components/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout, cartCount }) => {
  const [openMenu, setOpenMenu] = useState(false);
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

  return (
    <header className="bg-[#fdfaf4] py-4 px-6 md:px-12 shadow-sm flex justify-between items-center">
      <div className="text-xl font-extrabold tracking-wide text-black flex items-center gap-1">
        <span>🌿</span> BRAND.
      </div>

      <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-800">
        <Link to="/" className="hover:text-rose-500">Home</Link>
        <a href="#" className="hover:text-rose-500">Category</a>
        <a href="#" className="hover:text-rose-500">Best Sellers</a>
        <a href="#" className="hover:text-rose-500">Reviews</a>
        <a href="#" className="hover:text-rose-500">About</a>
      </nav>

      <div className="flex items-center space-x-4 relative">

        {user && <span className="text-sm hidden md:inline-block">Xin chào, {user.fullName}</span>}

        <div className="relative">
          <Link to="/cart">
            <div className="p-2 rounded-full border hover:bg-gray-100 transition relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="relative" ref={dropdownRef}>
          <img
            src={`https://i.pravatar.cc/150?u=${user?.userID || "guest"}`}
            alt="User"
            className="w-9 h-9 rounded-full border-2 border-white shadow cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          />
          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Hồ sơ cá nhân
              </Link>
              <Link to="/category-management" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Quản lý sản phẩm
              </Link>
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
  );
};

export default Header;
