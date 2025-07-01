// components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await axios.get('http://localhost:5000/api/products');
        const resCategories = await axios.get('http://localhost:5000/api/categories');
        setProducts(resProducts.data);
        setCategories(resCategories.data);
        setFilteredProducts(resProducts.data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (categoryID) => {
    setSelectedCategory(categoryID);
    if (!categoryID) return setFilteredProducts(products);
    setFilteredProducts(products.filter(p => p.categoryID === categoryID));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onFilter={handleFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.productID} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}