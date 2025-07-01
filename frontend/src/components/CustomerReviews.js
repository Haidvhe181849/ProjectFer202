import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Linh Tran',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    content: 'Sản phẩm cực kỳ chất lượng, da mình sáng hơn sau 2 tuần sử dụng.'
  },
  {
    id: 2,
    name: 'Hà Nguyễn',
    avatar: 'https://i.pravatar.cc/100?img=2',
    rating: 4,
    content: 'Mùi thơm dễ chịu, đóng gói cẩn thận, ship nhanh.'
  },
  {
    id: 3,
    name: 'Thu Thảo',
    avatar: 'https://i.pravatar.cc/100?img=3',
    rating: 5,
    content: 'Sẽ quay lại mua tiếp lần nữa, da mịn và không bị kích ứng.'
  },
  {
    id: 4,
    name: 'Hoàng My',
    avatar: 'https://i.pravatar.cc/100?img=4',
    rating: 5,
    content: 'Hỗ trợ tư vấn nhiệt tình, sản phẩm đúng như mô tả!'
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Reviews by Customers</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-gray-800">{review.name}</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">"{review.content}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;