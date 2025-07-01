import React, { useEffect, useState } from 'react';
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

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  if (user) {
    return (
      <div className="bg-white text-gray-800 min-h-screen">
        <Header user={user} onLogout={handleLogout} />
        <HeroSection />
        <BestSellers />
        <ProductList />
        <TrendingNow />
        <NewCollectionBanner />
        <FeatureIcons />
        <CustomerReviews />
        <ContactSection />
        <Footer />
      </div>
    );
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  if (showReset) {
    return <ResetPasswordForm onBack={() => setShowReset(false)} />;
  }

  return (
    <LoginForm
      onLogin={setUser}
      onRegister={() => setShowRegister(true)}
      onForgotPassword={() => setShowReset(true)}
    />
  );
}

export default App;
