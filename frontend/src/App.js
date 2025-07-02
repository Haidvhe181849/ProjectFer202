// App.js
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BestSellers from './components/BestSellers';
import TrendingNow from './components/TrendingNow';
import NewCollectionBanner from './components/NewCollectionBanner';
import FeatureIcons from './components/FeatureIcons';
import CustomerReviews from './components/CustomerReviews';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CategoryManagement from './components/CategoryManagement';
import RoleManagement from './components/RoleManagement';
import CartPage from './components/CartPage';
import UserProfile from './components/Profile/UserProfile';
import UserProfilePage from './components/Profile/UserProfilePage';

function HomePage({ user, onLogout, cartCount, updateCartCount }) {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Header user={user} onLogout={onLogout} cartCount={cartCount} />
      <HeroSection />
      <BestSellers />
      <ProductList user={user} updateCartCount={updateCartCount} />
      <TrendingNow />
      <NewCollectionBanner />
      <FeatureIcons />
      <CustomerReviews />
      <ContactSection />
      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Gọi API để lấy số lượng sản phẩm trong giỏ hàng
  const updateCartCount = async (userID) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/count?userID=${userID}`);
      setCartCount(res.data.totalItems || 0);
    } catch (err) {
      console.error('Lỗi cập nhật cart count:', err);
    }
  };

  // Gọi lại thông tin đầy đủ sau khi đăng nhập
  const handleLogin = async (loggedInUser, rememberMe = false) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/users/${loggedInUser.userID}`);
      const fullUser = res.data;
      setUser(fullUser);
      updateCartCount(fullUser.userID);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(fullUser));
    } catch (err) {
      console.warn('Lỗi khi lấy thông tin chi tiết user:', err);
      setUser(loggedInUser); // fallback nếu lỗi
    }
  };

  // Lấy user từ local/session storage khi load trang
  useEffect(() => {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (raw && token) {
      const parsedUser = JSON.parse(raw);
      handleLogin(parsedUser); // Luôn gọi để lấy full thông tin từ DB
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
  };

  // Trang đăng ký
  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  // Trang reset password
  if (showReset) {
    return <ResetPasswordForm onBack={() => setShowReset(false)} />;
  }

  // Trang login
  if (!user) {
    return (
      <Router>
        <LoginForm
          onLogin={(u, rememberMe) => handleLogin(u, rememberMe)}
          onRegister={() => setShowRegister(true)}
          onForgotPassword={() => setShowReset(true)}
        />
      </Router>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                onLogout={handleLogout}
                cartCount={cartCount}
                updateCartCount={() => updateCartCount(user.userID)}
              />
            }
          />
          <Route
            path="/category-management"
            element={<CategoryManagement user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/role-management"
            element={<RoleManagement user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                user={user}
                onLogout={handleLogout}
                cartCount={cartCount}
                updateCartCount={updateCartCount}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <UserProfile
                user={user}
                onLogout={handleLogout}
                cartCount={cartCount}
                updateCartCount={updateCartCount}
              />
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

export default App;
