import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ user }) => {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
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
        } catch (err) {
            setError('Mật khẩu cũ không đúng hoặc có lỗi xảy ra.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    value={form.oldPassword}
                    onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                    required
                    className="w-full border px-4 py-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                    className="w-full border px-4 py-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    className="w-full border px-4 py-2 rounded"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <button
                    type="submit"
                    className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-500"
                >
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;