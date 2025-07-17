import React from 'react';
import { Truck, RefreshCcw, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-8 h-8 text-rose-600" />,
    title: 'Free Shipping',
    desc: 'On all orders over 500K'
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-rose-600" />,
    title: 'Easy Returns',
    desc: 'Within 7 days of delivery'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-rose-600" />,
    title: '100% Authentic',
    desc: 'Guaranteed genuine products'
  }
];

const FeatureIcons = () => {
  return (
    <section className="bg-orange-50 py-12">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-center">
        {features.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow hover:shadow-md transition">
            <div className="mb-4 flex justify-center">{item.icon}</div>
            <h4 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureIcons;
