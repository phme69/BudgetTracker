import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerSideBar from './CustomerSideBar';

const CustomerShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // Fetch shop details
        axios.get(`http://localhost:8081/shops/${shopId}`)
            .then(response => {
                setShop(response.data);
            })
            .catch(error => {
                console.error('Error fetching shop details:', error);
            });

        // Fetch products for the shop
        axios.get(`http://localhost:8081/shops/${shopId}/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [shopId]);

    if (!shop) {
        return <div>Loading...</div>;
    }

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const handleAddToCart = (productId) => {
        const customerId = localStorage.getItem("customerID"); // Retrieve customer ID from localStorage
        if (!customerId) {
            setModalMessage('Customer not logged in.');
            setIsModalVisible(true);
            return;
        }

        const quantity = 1; // Default quantity
        axios.post('http://localhost:8081/cart', { customer_id: customerId, product_id: productId, quantity })
            .then(response => {
                setModalMessage('Product added to cart successfully!');
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Error adding item to cart:', error);
                setModalMessage('Failed to add product to cart.');
                setIsModalVisible(true);
            });
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setModalMessage('');
    };

    return (
        <div className="flex min-h-screen">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />
            <div className="flex-1 p-8 bg-gray-100">
                <header className="bg-red-500 text-white text-center py-4 sticky top-0 z-10 shadow-md">
                    <h1 className="text-3xl font-bold">{shop.shop_name}</h1>
                    <div className="header-info">
                        ⭐ {shop.rating} | 📍 {shop.location}
                    </div>
                </header>
                <div className="container mx-auto mt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Available Products</h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Back
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.product_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <img src={product.image_url} alt={product.title} className="w-full h-32 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold">{product.title}</h3>
                                    <p className="text-gray-700">{product.description}</p>
                                    <strong className="block mt-2 text-red-500">Tk {product.price}</strong>
                                    <button
                                        onClick={() => handleAddToCart(product.product_id)} // Ensure product_id is correctly used
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <footer className="text-center py-4 bg-red-500 text-white mt-6">
                    <p>&copy; 2025 Shop Name. All Rights Reserved.</p>
                </footer>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p>{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerShopDetails;
