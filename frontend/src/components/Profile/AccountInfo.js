// components/AccountInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountInfo({ user }) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
    });

    useEffect(() => {
        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/auth/users/${user.userID}`, formData);
            toast.success('✅ Cập nhật thành công', { autoClose: 2000 });
            setEditMode(false);
            const updatedUser = { ...user, ...formData };
            if (localStorage.getItem('user')) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.error('❌ Cập nhật thất bại');
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-8 shadow rounded-xl w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Hồ Sơ Của Tôi</h2>
            <p className="text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1">ID người dùng</label>
                    <input className="border rounded px-3 py-2" value={user.userID} disabled />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1">Tên đầy đủ</label>
                    {editMode ? (
                        <input
                            className="border rounded px-3 py-2"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="text-black font-medium">{user.fullName}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1">Tên đăng nhập</label>
                    <input className="border rounded px-3 py-2" value={user.username} disabled />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1">Email</label>
                    {editMode ? (
                        <input
                            className="border rounded px-3 py-2"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="text-black font-medium">{user.email || 'Chưa cập nhật'}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1">Số điện thoại</label>
                    {editMode ? (
                        <input
                            className="border rounded px-3 py-2"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="text-black font-medium">{user.phone || 'Chưa cập nhật'}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1">Địa chỉ</label>
                    {editMode ? (
                        <input
                            className="border rounded px-3 py-2"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className="text-black font-medium">{user.address || 'Chưa cập nhật'}</span>
                    )}
                </div>

                {editMode && (
                    <div className="md:col-span-2 text-right">
                        <button
                            type="submit"
                            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-500"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                )}
            </form>

            {!editMode && (
                <div className="mt-6 text-right">
                    <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Sửa hồ sơ
                    </button>
                </div>
            )}
        </div>
    );
}
