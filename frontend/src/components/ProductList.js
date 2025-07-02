import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

export default function ProductList({ user, updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Lấy danh sách sản phẩm và danh mục khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await axios.get('http://localhost:5000/api/products');
        const resCategories = await axios.get('http://localhost:5000/api/categories');
        setProducts(resProducts.data);
        setFilteredProducts(resProducts.data);
        setCategories(resCategories.data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm hoặc danh mục:', err);
        toast.error('Không thể tải dữ liệu sản phẩm!');
      }
    };
    fetchData();
  }, []);

  // Lọc theo danh mục
  const handleFilter = (categoryID) => {
    setSelectedCategory(categoryID);
    if (!categoryID) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoryID === categoryID));
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userID: user.userID,
        productID: product.productID,
        price: product.price,
        quantity: 1
      });

      toast.success(`✔️ Đã thêm "${product.productName}" vào giỏ hàng!`);
      updateCartCount(); // cập nhật lại số lượng giỏ hàng ở icon
    } catch (err) {
      console.error('Lỗi khi thêm vào giỏ hàng:', err);
      toast.error('❌ Thêm vào giỏ hàng thất bại!');
    }
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
          <ProductCard
            key={product.productID}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
