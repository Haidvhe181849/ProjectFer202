import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onLogin, onRegister, onForgotPassword }) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { identity, password });

      // Lưu token và user tạm thời
      const token = res.data.token;
      const user = res.data.user;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('user', JSON.stringify(user));

      // Gửi cả rememberMe về App
      onLogin(user, rememberMe);
      navigate('/');
    } catch (err) {
      setError('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div className="login-background">
      <form className="login-container" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username or Email"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> Remember me
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onForgotPassword === 'function') {
                onForgotPassword();
              }
            }}
          >
            Forgot password?
          </a>
        </div>

        <button type="submit" className="login-button">Login</button>

        <p className="register-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onRegister(); }}>Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
