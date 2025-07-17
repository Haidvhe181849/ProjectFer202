import React from 'react';

const NewCollectionBanner = () => {
  return (
    <section className="bg-white px-4 py-16 md:flex items-center justify-between gap-12 max-w-7xl mx-auto">
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Launching a New Collection</h2>
        <p className="text-gray-600 mb-6">
          Discover our latest beauty line curated for the modern you. Embrace elegance, feel confident, and glow naturally.
        </p>
        <button className="px-6 py-3 bg-rose-600 text-white rounded hover:bg-rose-500">View Collection</button>
      </div>
      <div className="md:w-1/2 mt-10 md:mt-0">
        <img src="https://via.placeholder.com/500x350.png?text=New+Collection" alt="New Collection" className="w-full rounded-lg shadow-md" />
      </div>
    </section>
  );
};

export default NewCollectionBanner;
