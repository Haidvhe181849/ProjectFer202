import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [bestProduct, setBestProduct] = useState(null);

  // Countdown logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        const total = prev.hours * 3600 + prev.minutes * 60 + prev.seconds;
        if (total <= 0) {
          clearInterval(countdown);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        const newTotal = total - 1;
        return {
          hours: Math.floor(newTotal / 3600),
          minutes: Math.floor((newTotal % 3600) / 60),
          seconds: newTotal % 60
        };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Fetch best selling product
  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const sorted = res.data.sort((a, b) => b.sold - a.sold);
        setBestProduct(sorted[0]); // top 1
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm bán chạy:', err);
      }
    };
    fetchBestSeller();
  }, []);

  return (
    <section className="bg-orange-50 py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">

        {/* Left: Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Unlock the Secrets to <br /> Radiant Skin
          </h1>
          <p className="text-gray-600 mt-4">
            We're here to provide the best skincare and beauty products, which help you to be the real you!
          </p>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800">
              Shop Now
            </button>

            {/* Countdown */}
            <div className="bg-white rounded-xl shadow px-4 py-2">
              <p className="text-xs font-semibold text-red-500">LIMITED OFFER</p>
              <p className="text-sm text-gray-700">Get 20% Off New Products</p>
              <p className="text-lg font-mono text-rose-600">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Image + Product */}
        <div className="flex flex-col items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1600180758890-6ec9d1f0c0b3?auto=format&fit=crop&w=480&q=80"
            alt="Model"
            className="w-72 md:w-80 rounded-3xl object-cover shadow-md"
          />

          {/* Product Card */}
          {bestProduct && (
            <div className="mt-6 bg-white rounded-xl shadow p-4 w-64 text-center">
              <img
                src={bestProduct.image}
                alt={bestProduct.productName}
                className="h-24 mx-auto object-contain"
              />
              <div className="mt-2 font-semibold text-gray-800">{bestProduct.productName}</div>
              <div className="text-rose-600 font-bold text-lg mt-1">
                ${bestProduct.price}
                {bestProduct.originalPrice && (
                  <span className="text-gray-400 line-through text-sm ml-2">
                    ${bestProduct.originalPrice}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

  );
};

export default HeroSection;
