// components/CategoryFilter.js
import React from 'react';

export default function CategoryFilter({ categories, selected, onFilter }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onFilter('')}
        className={`px-4 py-2 rounded-full border ${selected === '' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600'} hover:shadow`}
      >
        Tất cả
      </button>
      {categories.map(cat => (
        <button
          key={cat.categoryID}
          onClick={() => onFilter(cat.categoryID)}
          className={`px-4 py-2 rounded-full border ${selected === cat.categoryID ? 'bg-rose-600 text-white' : 'bg-white text-rose-600'} hover:shadow`}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>
  );
}