// components/Cart.js
import React from 'react';

export default function Cart({ cartItems, onRemove }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold text-rose-700 mb-4">Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Chưa có sản phẩm nào.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <li key={item.productID} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-500">{item.quantity} x {Number(item.price).toLocaleString()}đ</p>
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => onRemove(item.productID)}
              >
                Xoá
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 text-right">
        <p className="text-rose-600 font-bold">Tổng: {total.toLocaleString()}đ</p>
        <button className="bg-rose-600 text-white mt-2 px-4 py-1 rounded-full hover:bg-rose-500">
          Thanh toán
        </button>
      </div>
    </div>
  );
}
