// components/CheckoutForm.js
import React, { useState } from 'react';

export default function CheckoutForm({ onSubmitOrder }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !phone) return alert('Vui lòng điền đầy đủ thông tin.');
    onSubmitOrder({ name, address, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white max-w-md mx-auto p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold text-rose-700 mb-4">Thông tin đặt hàng</h2>
      <input
        type="text"
        placeholder="Họ và tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="text"
        placeholder="Số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <button type="submit" className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-500 w-full">
        Đặt hàng
      </button>
    </form>
  );
}
