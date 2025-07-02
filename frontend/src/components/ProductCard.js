import React from 'react';
import { FaShoppingBag, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart }) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition relative flex flex-col justify-between h-full">
      <div className="relative">
        <img src={product.image} alt={product.productName} className="w-full h-56 object-contain rounded-xl mb-3" />

        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {discountPercent}% Off
          </div>
        )}

        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-rose-100 transition">
          <FaHeart className="text-gray-600" />
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-1">Name: {product.productName}</h3>
      <h3 className="font-semibold text-lg mb-1">Sold: {product.sold}</h3>

      <div className="flex items-center mb-1">
        <span className="text-red-600 font-bold text-lg mr-2">Price: {product.price.toLocaleString()}₫</span>
        {product.originalPrice && (
          <span className="line-through text-sm text-gray-400">{product.originalPrice.toLocaleString()}₫</span>
        )}
      </div>

      <button
        className="w-full py-2 border rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-rose-600 hover:text-white transition mt-auto"
        onClick={() => onAddToCart(product)}
      >
        <FaShoppingBag />
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;
