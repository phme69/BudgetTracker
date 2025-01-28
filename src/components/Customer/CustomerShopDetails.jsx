import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CustomerSideBar from "./CustomerSideBar";

const CustomerShopDetails = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] =
        useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Fetch shop details
        axios
            .get(`http://localhost:8081/shops/${shopId}`)
            .then((response) => {
                setShop(response.data);
            })
            .catch((error) => {
                console.error("Error fetching shop details:", error);
            });

        // Fetch products for the shop
        axios
            .get(`http://localhost:8081/shops/${shopId}/products`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, [shopId]);

    if (!shop) {
        return <div>Loading...</div>;
    }

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const handleAddToCart = async (productId) => {
        const customerId = localStorage.getItem("customerID"); // Retrieve customer ID from localStorage
        if (!customerId) {
            setErrorMessage("Customer not logged in.");
            return;
        }

        const quantity = 1; // Default quantity
        try {
            await axios.post("http://localhost:8081/cart", {
                customer_id: customerId,
                product_id: productId,
                quantity,
            });
            setIsSuccessMessageVisible(true);
        } catch (error) {
            console.error("Error adding item to cart:", error);
            setErrorMessage("Failed to add product to cart.");
        }
    };

    const closeSuccessMessage = () => {
        setIsSuccessMessageVisible(false);
        setErrorMessage("");
    };

    const openProductDetails = (product) => {
        setSelectedProduct(product);
    };

    const closeProductDetails = () => {
        setSelectedProduct(null);
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
                        <h2 className="text-2xl font-bold">
                            Available Products
                        </h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Back
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.product_id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                                onClick={() => openProductDetails(product)}>
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold">
                                        {product.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {product.description}
                                    </p>
                                    <strong className="block mt-2 text-red-500">
                                        Tk {product.price}
                                    </strong>
                                    <button
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product.product_id);
                                        }}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedProduct.title}
                        </h2>
                        <img
                            src={selectedProduct.image_url}
                            alt={selectedProduct.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600 mb-4">
                            {selectedProduct.description}
                        </p>
                        <p className="text-gray-800 font-bold mb-4">
                            {selectedProduct.price} Taka
                        </p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                            onClick={() =>
                                handleAddToCart(selectedProduct.product_id)
                            }>
                            Add to Cart
                        </button>
                        <button
                            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg"
                            onClick={closeProductDetails}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isSuccessMessageVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p>Product added successfully!</p>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={closeSuccessMessage}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p>{errorMessage}</p>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={closeSuccessMessage}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerShopDetails;