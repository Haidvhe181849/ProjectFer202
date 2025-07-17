// components/UserProfile.js
import React, { useState } from 'react';
import AccountInfo from './AccountInfo';
import ChangePassword from './ChangePassword';
import CartSummary from './CartSummary';
import OrderHistory from './OrderHistory';
import Header from '../Header';

export default function UserProfile({ user, onLogout, cartCount, updateCartCount }) {
  const [selectedSection, setSelectedSection] = useState('account');

  const renderContent = () => {
    switch (selectedSection) {
      case 'account':
        return <AccountInfo user={user} />;
      case 'change-password':
        return <ChangePassword user={user} />;
      case 'cart':
        return <CartSummary user={user} updateCartCount={updateCartCount} />;
      case 'orders':
        return <OrderHistory user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf4] text-gray-800">
      <Header user={user} onLogout={onLogout} cartCount={cartCount} />
      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-r p-6">
          <h2 className="text-lg font-semibold mb-4">Tài khoản của tôi</h2>
          <ul className="space-y-3">
            <li
              onClick={() => setSelectedSection('account')}
              className={`cursor-pointer px-3 py-2 rounded ${selectedSection === 'account' ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:bg-gray-100'}`}
            >
              Hồ sơ
            </li>
            <li
              onClick={() => setSelectedSection('change-password')}
              className={`cursor-pointer px-3 py-2 rounded ${selectedSection === 'change-password' ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:bg-gray-100'}`}
            >
              Đổi mật khẩu
            </li>
            <li
              onClick={() => setSelectedSection('cart')}
              className={`cursor-pointer px-3 py-2 rounded ${selectedSection === 'cart' ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:bg-gray-100'}`}
            >
              Giỏ hàng
            </li>
            <li
              onClick={() => setSelectedSection('orders')}
              className={`cursor-pointer px-3 py-2 rounded ${selectedSection === 'orders' ? 'text-rose-600 font-semibold bg-rose-50' : 'hover:bg-gray-100'}`}
            >
              Đơn mua
            </li>
          </ul>
        </div>

        <div className="col-span-3 bg-white shadow rounded-xl p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
