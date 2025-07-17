import React from 'react';

const trending = [
  {
    id: 1,
    name: 'Soothing Cleanser',
    image: 'https://via.placeholder.com/120.png?text=Cleanser',
  },
  {
    id: 2,
    name: 'Rosewater Toner',
    image: 'https://via.placeholder.com/120.png?text=Toner',
  },
  {
    id: 3,
    name: 'Night Repair Cream',
    image: 'https://via.placeholder.com/120.png?text=Night+Cream',
  },
  {
    id: 4,
    name: 'Brightening Serum',
    image: 'https://via.placeholder.com/120.png?text=Serum',
  },
];

const TrendingNow = () => {
  return (
    <section className="bg-orange-50 py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Trending Now</h2>
      <div className="flex justify-center flex-wrap gap-6 max-w-5xl mx-auto">
        {trending.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-rose-400 shadow-md hover:scale-105 transition">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingNow;
