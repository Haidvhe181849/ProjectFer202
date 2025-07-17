import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews/latest'); 
        console.log('Fetched reviews:', res.data); 
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-16 px-4 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Reviews by Customers</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="border rounded-lg p-6 shadow-sm hover:shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={`https://i.pravatar.cc/100?u=${review.userID}`}
                alt={review.fullName}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-gray-800">{review.fullName}</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
