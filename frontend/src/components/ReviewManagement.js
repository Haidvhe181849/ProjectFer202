import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderManagement from './HeaderManagement';

const ReviewManagement = ({ user = { userID: 'admin', fullName: 'Admin' }, onLogout }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data);
      setFilteredReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá review này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${id}`);
        const updated = reviews.filter((r) => r.reviewID !== id);
        setReviews(updated);
        setFilteredReviews(updated);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];
    if (searchUser) {
      filtered = filtered.filter((r) => r.fullName?.toLowerCase().includes(searchUser.toLowerCase()));
    }
    if (searchProduct) {
      filtered = filtered.filter((r) => r.productName?.toLowerCase().includes(searchProduct.toLowerCase()));
    }
    if (ratingFilter) {
      filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter));
    }
    if (dateFrom) {
      filtered = filtered.filter((r) => new Date(r.reviewDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((r) => new Date(r.reviewDate) <= new Date(dateTo));
    }
    setFilteredReviews(filtered);
  };

  const resetFilters = () => {
    setSearchUser('');
    setSearchProduct('');
    setRatingFilter('');
    setDateFrom('');
    setDateTo('');
    setFilteredReviews(reviews);
  };

  return (
    <div className="min-h-screen bg-[#fffafc]">
      <HeaderManagement user={user} onLogout={onLogout} activePath="/review-management" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-700">Review Management</h2>
        </div>

        <div className="mb-6 bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <input
            type="text"
            placeholder="Search by user"
            className="border px-3 py-2 rounded"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by product"
            className="border px-3 py-2 rounded"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">Rating</option>
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </select>
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <div className="flex gap-2 md:col-span-5">
            <button onClick={applyFilters} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-500">Filter</button>
            <button onClick={resetFilters} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">All</button>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-pink-100 text-pink-700 font-semibold">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Rating</th>
                <th className="p-3 border">Comment</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((r, index) => (
                <tr key={r.reviewID || index} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{index + 1}</td>
                  <td className="p-3 border">{r.fullName}</td>
                  <td className="p-3 border">{r.productName}</td>
                  <td className="p-3 border text-center">{r.rating}</td>
                  <td className="p-3 border">{r.comment}</td>
                  <td className="p-3 border">
                    {new Date(r.reviewDate).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDelete(r.reviewID)}
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ReviewManagement;