import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const ResetPasswordForm = ({ onBack }) => {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    username: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^\d{9,11}$/.test(form.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!form.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }

    if (form.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải từ 6 ký tự';
    }

    if (form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setServerError('');

    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: form.email,
        phone: form.phone,
        username: form.username,
        newPassword: form.newPassword,
      });

      setMessage('Mật khẩu đã được đặt lại thành công!');
      setForm({
        email: '',
        phone: '',
        username: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Đã xảy ra lỗi server');
    }
  };

  return (
    <div className="login-background">
      <form className="login-container" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-white">Quên mật khẩu</h2>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="error text-left">{errors.email}</p>}
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <p className="error text-left">{errors.phone}</p>}
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          {errors.username && <p className="error text-left">{errors.username}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          {errors.newPassword && <p className="error text-left">{errors.newPassword}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className="error text-left">{errors.confirmPassword}</p>}
        </div>

        {serverError && <p className="error text-left">{serverError}</p>}
        {message && <p className="text-green-400 text-sm text-left mb-2">{message}</p>}

        <div className="login-options">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Quay lại đăng nhập</a>
          <button type="submit" className="login-button">Đặt lại mật khẩu</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;