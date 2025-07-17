import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">MyBeauty</h4>
          <p className="text-sm text-gray-400">
            Chăm sóc làn da bạn mỗi ngày với những sản phẩm chất lượng và đáng tin cậy.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Products</a></li>
            <li><a href="#" className="hover:underline">Offers</a></li>
            <li><a href="#" className="hover:underline">Best Sellers</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#"><Facebook className="w-6 h-6 hover:text-rose-500" /></a>
            <a href="#"><Instagram className="w-6 h-6 hover:text-rose-500" /></a>
            <a href="#"><Youtube className="w-6 h-6 hover:text-rose-500" /></a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-10">© 2025 MyBeauty. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
