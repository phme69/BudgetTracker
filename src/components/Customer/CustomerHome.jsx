import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomerSideBar from "./CustomerSideBar";
import axios from "axios";
import ProductCard from "./ProductCard"; // Import the ProductCard component
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CustomerHome = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const location = useLocation();
    const locationState = location.state || {};
    const { customerID: locationcustomerID, name: locationcustomerName } =
        locationState;

    useEffect(() => {
        if (locationcustomerID && locationcustomerName) {
            localStorage.setItem("customerID", locationcustomerID);
            localStorage.setItem("customerName", locationcustomerName);
        }
    }, [locationcustomerID, locationcustomerName]);

    const customerID = localStorage.getItem("customerID") || "Unknown";
    const customerName = localStorage.getItem("customerName") || "Customer";

    const [customerInfo, setCustomerInfo] = useState(null);
    useEffect(() => {
        // Fetch customer information
        axios
            .get("http://localhost:8081/customer-info", {
                params: { customer_id: customerID },
            })
            .then((response) => {
                setCustomerInfo(response.data);
            })
            .catch((error) => {
                console.error("Error fetching customer info:", error);
            });
    }, []);

    const getCustomerLevelString = (level) => {
        switch (level) {
            case 10:
                return "Diamond";
            case 9:
                return "Platinum";
            case 8:
                return "Gold";
            case 7:
                return "Silver";
            case 6:
                return "Bronze";
            case 5:
                return "Premium";
            case 4:
                return "Plus";
            case 3:
                return "Pro";
            default:
                return "Standard";
        }
    };

    return (
        <>
            <div className="flex">
                <CustomerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                    customerID={customerID}
                    name={customerName}
                />
                <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-r from-[#d0f4de] to-[#c7f9cc] p-8">
                    {customerInfo && (
                        <div className="p-6 bg-[#caffbf] shadow-lg rounded-lg transform transition-all duration-500  hover:shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-4xl font-extrabold text-gray-800 animate-fadeInDown">
                                    Welcome, {customerInfo.customer_name}
                                </h1>
                                <p className="text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                    Level -{" "}
                                    {getCustomerLevelString(
                                        customerInfo.customer_level
                                    )}
                                </p>
                            </div>
                            <p className="text-gray-600 text-lg">
                                Customer ID:{" "}
                                <span className="font-semibold">
                                    {customerInfo.customer_id}
                                </span>
                            </p>
                        </div>
                    )}
                    <CustomerHomeOffers />
                </div>
            </div>
        </>
    );
};

const CustomerHomeOffers = () => {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // State to manage selected product for modal
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] =
        useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Fetch discounted products
        axios
            .get("http://localhost:8081/chome-discounted-products")
            .then((response) => {
                setDiscountedProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching discounted products:", error);
            });
    }, []);

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
        <div className="min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8 w-full">
                {/* News & Updates Section */}
                <div className="col-span-1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 w-full">
                    <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-wide border-b-4 border-indigo-500 inline-block">
                        News & Updates
                    </h2>
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        autoPlay
                        interval={3000}
                        className="rounded-xl overflow-hidden shadow-md transition-all duration-300">
                        <div>
                            <img
                                src="projectimages/news/n1.jpeg"
                                alt="News 1"
                                className="h-96 w-full object-cover"
                            />
                        </div>
                        <div>
                            <img
                                src="projectimages/news/news2.jpg"
                                alt="News 2"
                                className="h-96 w-full object-cover"
                            />
                        </div>
                        <div>
                            <img
                                src="projectimages/news/news3.jpg"
                                alt="News 3"
                                className="h-96 w-full object-cover"
                            />
                        </div>
                    </Carousel>
                </div>

                {/* Sponsor Section */}
                <div className="col-span-1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
                    <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-wide border-b-4 border-green-500 inline-block">
                        Sponsor
                    </h2>
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        autoPlay
                        interval={3000}
                        className="rounded-xl overflow-hidden shadow-md transition-all duration-300">
                        <div>
                            <img
                                src="projectimages/news/ads2.jpg"
                                alt="Sponsor 2"
                                className="h-96 w-full object-cover"
                            />
                        </div>
                        <div>
                            <img
                                src="projectimages/news/ads3.jpg"
                                alt="Sponsor 3"
                                className="h-96 w-full object-cover"
                            />
                        </div>
                    </Carousel>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-800">
                Special Offers & Discount
            </h2>
            <div className="grid grid-cols-5 gap-4">
                {discountedProducts.map((product, index) => (
                    <div
                        key={product.discount_id}
                        className={`bg-gradient-to-r ${
                            index % 2 === 0
                                ? "from-blue-500 to-teal-500"
                                : "from-yellow-500 to-orange-500"
                        } rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl`}
                        style={{ width: "250px", height: "250px" }} // Set square size
                        onClick={() => openProductDetails(product)}>
                        <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-2/3 object-cover rounded-t-lg"
                        />
                        <div className="text-white text-center p-4 h-1/3 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold">
                                {product.title}
                            </h3>
                            <p className="text-lg">
                                {product.discountPercent}% off
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show Product Details Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {console.log(selectedProduct)}
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
                            {selectedProduct.discountPercent}% off
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
export default CustomerHome;
