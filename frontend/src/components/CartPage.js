// components/CartPage.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import Header from './Header';

export default function CartPage({ user, onLogout, cartCount, updateCartCount }) {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const fetchCart = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/cart/user/${user.userID}`);
            setCartItems(res.data);
            updateCartCount(user.userID);
        } catch (err) {
            console.error('Lỗi khi lấy giỏ hàng:', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const handleQuantityChange = async (productID, delta) => {
        const updatedItem = cartItems.find(item => item.productID === productID);
        const newQty = updatedItem.quantity + delta;
        if (newQty < 1) return;

        try {
            await axios.put(`http://localhost:5000/api/cart/update`, {
                userID: user.userID,
                productID,
                quantity: newQty
            });
            fetchCart();
        } catch (err) {
            console.error('Lỗi khi thay đổi số lượng:', err);
        }
    };

    const handleDelete = async (productID) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/delete`, {
                data: { userID: user.userID, productID }
            });
            fetchCart();
        } catch (err) {
            console.error('Lỗi khi xoá sản phẩm:', err);
        }
    };

    const handleBatchDelete = async () => {
        for (const productID of selectedItems) {
            await handleDelete(productID);
        }
        setSelectedItems([]);
        setSelectAll(false);
    };

    const toggleSelectItem = (productID) => {
        setSelectedItems(prev =>
            prev.includes(productID) ? prev.filter(id => id !== productID) : [...prev, productID]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.productID));
        }
        setSelectAll(!selectAll);
    };

    const total = cartItems
        .filter(item => selectedItems.includes(item.productID))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="bg-[#fdfaf4] min-h-screen">
            <Header user={user} onLogout={onLogout} cartCount={cartCount} />
            <div className="max-w-7xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">🛒 Giỏ Hàng của bạn</h2>

                <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2 mb-2 text-sm">
                    <div className="col-span-3 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                        />
                        <span>Sản Phẩm</span>
                    </div>
                    <div className="text-center">Đơn Giá</div>
                    <div className="text-center">Số Lượng</div>
                    <div className="text-right">Thao Tác</div>
                </div>

                {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">Giỏ hàng trống.</p>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <div
                                key={item.productID}
                                className="grid grid-cols-6 items-center gap-4 border-b py-4"
                            >
                                <div className="col-span-3 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.productID)}
                                        onChange={() => toggleSelectItem(item.productID)}
                                    />
                                    <img
                                        src={item.image || 'https://via.placeholder.com/60'}
                                        alt={item.productName}
                                        className="w-16 h-16 object-contain border rounded"
                                    />
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">{item.productName}</h4>
                                        <p className="text-xs text-gray-400">Mã: {item.productID}</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <span className="text-sm text-gray-700 font-medium">
                                        {item.price.toLocaleString()} ₫
                                    </span>
                                </div>

                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.productID, -1)}
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.productID, 1)}
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-rose-600 text-sm mb-2">
                                        {(item.price * item.quantity).toLocaleString()} ₫
                                    </p>
                                    <button
                                        onClick={() => handleDelete(item.productID)}
                                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                                    >
                                        <FaTrashAlt /> Xóa
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-6 border-t pt-4">
                            <div className="flex items-center gap-4">
                                <span>
                                    Đã chọn {selectedItems.length}/{cartItems.length} sản phẩm
                                </span>
                                <button
                                    onClick={handleBatchDelete}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Xoá các mục đã chọn
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-semibold">
                                    Tổng cộng ({selectedItems.length} sản phẩm): {total.toLocaleString()} ₫
                                </p>
                                <button className="mt-3 bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-500">
                                    Mua hàng
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
