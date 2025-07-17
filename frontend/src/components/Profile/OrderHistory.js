import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = ({ user }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:5000/api/orders/user/${user.userID}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error('Lỗi khi tải đơn hàng:', err));
    }, [user]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Đơn Mua</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.orderID} className="border p-4 rounded shadow-sm">
                            <p><strong>Mã đơn hàng:</strong> {order.orderID}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p><strong>Tổng tiền:</strong> {order.total.toLocaleString()}₫</p>
                            <p><strong>Trạng thái:</strong> {order.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
