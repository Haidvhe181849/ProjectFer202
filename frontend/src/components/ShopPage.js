// pages/ShopPage.js
import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';

export default function ShopPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(p => p.productID === product.productID);
      if (exists) {
        return prev.map(p =>
          p.productID === product.productID
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productID) => {
    setCartItems(prev => prev.filter(item => item.productID !== productID));
  };

  const handleSubmitOrder = (orderData) => {
    // mock submit or connect to /api/orders
    console.log('Đặt hàng với:', orderData, cartItems);
    alert('Đặt hàng thành công!');
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center text-rose-700 mb-6">Cửa hàng mỹ phẩm</h1>
        <ProductList onAddToCart={handleAddToCart} />
        <Cart cartItems={cartItems} onRemove={handleRemoveFromCart} />
        {!showCheckout && cartItems.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => setShowCheckout(true)}
              className="mt-4 bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-500"
            >
              Tiến hành đặt hàng
            </button>
          </div>
        )}
        {showCheckout && (
          <CheckoutForm onSubmitOrder={handleSubmitOrder} />
        )}
      </div>
    </div>
  );
}
