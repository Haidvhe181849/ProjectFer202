import React from 'react';
import { FaUser, FaLock, FaShoppingCart, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

export default function SidebarMenu({ active, onChange, onLogout }) {
  const menu = [
    { key: 'profile', label: 'Tài khoản của tôi', icon: <FaUser /> },
    { key: 'password', label: 'Đổi mật khẩu', icon: <FaLock /> },
    { key: 'cart', label: 'Giỏ Hàng', icon: <FaShoppingCart /> },
    { key: 'orders', label: 'Đơn Mua', icon: <FaClipboardList /> }
  ];

  return (
    <aside className="bg-white shadow rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Tôi</h3>
      <ul className="space-y-2">
        {menu.map(item => (
          <li
            key={item.key}
            className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-rose-50 transition ${
              active === item.key ? 'bg-rose-100 text-rose-600 font-semibold' : ''
            }`}
            onClick={() => onChange(item.key)}
          >
            {item.icon} {item.label}
          </li>
        ))}
        <li
          className="flex items-center gap-2 cursor-pointer p-2 rounded text-red-600 hover:bg-red-50"
          onClick={onLogout}
        >
          <FaSignOutAlt /> Đăng xuất
        </li>
      </ul>
    </aside>
  );
}