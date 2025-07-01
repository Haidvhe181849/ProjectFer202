import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

function RegisterForm({ onBack }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const validUsername = /^[a-zA-Z0-9._]{4,20}$/;
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validPhone = /^0\d{9}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !username || !email || !password || !confirmPassword) {
      return setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
    }

    if (!validUsername.test(username)) {
      return setError('Username không hợp lệ. Dùng chữ cái, số, dấu _ hoặc . và từ 4-20 ký tự.');
    }

    if (!validEmail.test(email)) {
      return setError('Email không đúng định dạng.');
    }

    if (!strongPassword.test(password)) {
      return setError('Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.');
    }

    if (password !== confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp.');
    }

    if (phone && !validPhone.test(phone)) {
      return setError('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số).');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        address: address.trim(),
        phone: phone.trim()
      });
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Email hoặc Username đã tồn tại.');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="login-background">
      <form className="login-container" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: 'lightgreen' }}>{success}</p>}

        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <div className="input-group">
          <FaMapMarkerAlt className="icon" />
          <input type="text" placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="input-group">
          <FaPhone className="icon" />
          <input type="text" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <button type="submit" className="login-button">Register</button>
        <p className="register-link">
          Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Đăng nhập</a>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;