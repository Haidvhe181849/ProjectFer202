import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const sorted = res.data.sort((a, b) => b.sold - a.sold);
        setBestSellers(sorted.slice(0, 20));
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm bán chạy:', err);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Best Sellers</h2>
        <button className="text-sm border px-4 py-1 rounded-full hover:bg-gray-100 transition">
          View All Products →
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
        {bestSellers.map(product => (
          <div className="min-w-[260px] max-w-[280px]">
            <ProductCard key={product.productID} product={product} />
          </div>
        ))}
      </div>
    </section>

  );
};

export default BestSellers;