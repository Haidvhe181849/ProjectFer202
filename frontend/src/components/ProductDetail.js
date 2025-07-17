import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const ProductDetail = ({ user, onLogout, cartCount, updateCartCount }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                const [resProduct, resReviews] = await Promise.all([
                    axios.get(`http://localhost:5000/api/products/${id}`),
                    axios.get(`http://localhost:5000/api/reviews/product/${id}`)
                ]);
                setProduct(resProduct.data);
                setReviews(resReviews.data);
            } catch (err) {
                setError('Không tìm thấy sản phẩm.');
            }
        };
        fetchProductAndReviews();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) return alert('Vui lòng đăng nhập để mua hàng!');

        if (quantity > product.quantity) {
            alert(`❌ Chỉ còn lại ${product.quantity} sản phẩm trong kho!`);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/cart/add', {
                userID: user.userID,
                productID: product.productID,
                quantity,
                price: product.price
            });

            updateCartCount(user.userID);
            alert('✔️ Đã thêm vào giỏ hàng!');
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi khi thêm vào giỏ hàng.');
        }
    };


    if (!product) return <div className="text-center text-red-500 p-10">{error}</div>;

    return (
        <div className="bg-[#fffafc] min-h-screen">
            <Header user={user} onLogout={onLogout} cartCount={cartCount} />

            <main className="max-w-6xl mx-auto px-6 py-10 bg-[#fffafc]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    {/* Hình ảnh sản phẩm */}
                    <div className="border rounded-xl overflow-hidden shadow-md bg-white">
                        <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full object-contain h-[400px]"
                        />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div>
                        <h1 className="text-3xl font-bold text-rose-700 mb-4">{product.productName}</h1>

                        <p className="text-gray-700 mb-3 text-base">{product.describe || 'Không có mô tả.'}</p>

                        <div className="text-2xl font-semibold text-red-600 mb-4">
                            {product.price.toLocaleString('vi-VN')}₫
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                            <input
                                type="number"
                                min={1}
                                max={product.quantity}
                                value={quantity}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val <= product.quantity) setQuantity(val);
                                }}
                                className="border p-2 w-20 rounded-md"
                            />
                            <span className="text-sm text-gray-500">(Còn {product.quantity} sản phẩm)</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-full flex items-center gap-2"
                            >
                                <ShoppingCart size={18} />
                                Thêm vào giỏ hàng
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border rounded-full hover:bg-gray-100"
                            >
                                ← Quay lại
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mô tả chi tiết sản phẩm */}
                <section className="mt-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Mô tả chi tiết</h2>
                    <p className="bg-white p-4 rounded shadow text-gray-700 leading-relaxed">
                        {product.describe || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                    </p>
                </section>

                {/* Đánh giá sản phẩm */}
                <section className="mt-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h2>
                    {reviews.length > 0 ? (
                        reviews.map((r, index) => (
                            <div key={index} className="bg-white p-4 rounded shadow mb-3">
                                <p className="font-semibold">{r.fullName}</p>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                                <p className="text-gray-700">{r.comment}</p>
                                <p className="text-right text-sm text-gray-400">
                                    {new Date(r.reviewDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Chưa có đánh giá nào cho sản phẩm này.</p>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
