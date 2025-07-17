import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrendingNow = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const sorted = res.data
          .sort((a, b) => new Date(b.importDate) - new Date(a.importDate)) 
          .slice(0, 6);
        setLatestProducts(sorted);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="bg-orange-50 py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">News Products</h2>
      <div className="flex justify-center flex-wrap gap-6 max-w-5xl mx-auto">
        {latestProducts.map((item) => (
          <div key={item.productID} className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-rose-400 shadow-md hover:scale-105 transition">
              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 text-center">{item.productName}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingNow;
