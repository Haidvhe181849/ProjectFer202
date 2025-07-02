import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartSummary = ({ user }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:5000/api/cart/user/${user.userID}`)
            .then(res => setCartItems(res.data))
            .catch(err => console.error('Lỗi khi tải giỏ hàng:', err));
    }, [user]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Giỏ Hàng</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.productID} className="flex justify-between border-b pb-2">
                            <span>{item.productName}</span>
                            <span>{item.quantity} x {item.price.toLocaleString()}₫</span>
                        </div>
                    ))}
                    <p className="font-semibold text-right">Tổng cộng: {total.toLocaleString()}₫</p>
                </div>
            )}
        </div>
    );
};

export default CartSummary;