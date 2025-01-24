import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [shops, setShops] = useState([]);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [freeDeliveryProducts, setFreeDeliveryProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearchTriggered(false);
            return;
        }

        axios
            .get("http://localhost:8081/search-products", {
                params: { title: searchQuery },
            })
            .then((response) => {
                setSearchResults(response.data);
                setIsSearchTriggered(true);
            })
            .catch((error) => {
                console.error("Error searching products:", error);
                setSearchResults([]);
                setIsSearchTriggered(true);
            });
    };

    useEffect(() => {
        axios
            .get("http://localhost:8081/categories")
            .then((response) => setCategories(response.data))
            .catch((error) =>
                console.error("Error fetching categories:", error)
            );

        fetchAllShops();
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:8081/discounted-products")
            .then((response) => setDiscountedProducts(response.data))
            .catch((error) =>
                console.error("Error fetching discounted products:", error)
            );

        axios
            .get("http://localhost:8081/free-delivery-products")
            .then((response) => setFreeDeliveryProducts(response.data))
            .catch((error) =>
                console.error("Error fetching free delivery products:", error)
            );
    }, []);

    const fetchAllShops = () => {
        axios
            .get("http://localhost:8081/shops")
            .then((response) => setShops(response.data))
            .catch((error) => console.error("Error fetching shops:", error));
    };

    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

    const handleOpenModal = (event) => {
        const x = event.clientX + 20; // Horizontal position of the mouse click
        const y = event.clientY + window.scrollY; // Vertical position of the mouse click adjusted for scroll

        setModalPosition({ x, y });
        setShowModal(true);
    };

    return (
        <div className="bg-gradient-to-r from-[#FAFFC5] to-[#C5FFD8] backdrop-blur-md min-h-screen p-14 font-sans">
            <div className="flex justify-center items-center mb-10">
                <div className="relative w-full font-exo">
                    <input
                        type="text"
                        placeholder="Search for Product..."
                        className="w-full py-5 px-8 border-none rounded-e-full shadow-lg focus:outline-none focus:underline-offset-auto transition-all duration-300 text-gray-800 text-lg bg-gradient-to-r from-[#a9def9] to-[#d0f4de] placeholder-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                // Detect Enter key press
                                handleSearch(); // Trigger the search
                            }
                        }}
                    />
                    <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gradient-to-r from-[#02c39a] to-[#02c39a] text-white rounded-full p-4 hover:scale-105 shadow-lg transition-all duration-300"
                        aria-label="Search"
                        onClick={handleSearch}>
                        🔍
                    </button>
                </div>
            </div>

            {showModal && (
                <div
                    className="fixed z-50"
                    style={{
                        top: modalPosition.y - 50, // Offset to avoid clipping (modal's height)
                        left: modalPosition.x - 150, // Center horizontally based on modal's width
                        transform: "translate(-50%, -50%)", // This centers the modal based on the x and y coordinates
                    }}>
                    <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={() => setShowModal(false)}
                            aria-label="Close Modal">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold mb-6">
                            Kindly Sign In to Order Items
                        </h2>
                        <button
                            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-4 px-8 rounded-lg"
                            onClick={() => {
                                setShowModal(false);
                                navigate("/signin-customer");
                            }}>
                            Sign In
                        </button>
                    </div>
                </div>
            )}

            {/* Search Results */}
            {isSearchTriggered && (
                <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-6">Search Results</h2>
                    {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 cursor-pointer"
                                    onClick={handleOpenModal} // Show modal when clicking the item
                                >
                                    <img
                                        src={product.image_url}
                                        alt={product.title}
                                        className="h-48 w-full object-cover rounded-t-lg"
                                    />
                                    <div className="p-4 bg-white bg-opacity-75">
                                        <h3 className="text-lg font-bold">
                                            {product.title}
                                        </h3>
                                        <p>{product.price} taka</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-600">
                            No products found for "{searchQuery}".
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
                {/* Left section (News & Updates Header) */}
                <div className="col-span-2 relative">
                    <h2 className="text-4xl font-extrabold text-[#333] mb-6 tracking-wide">
                        News & Updates
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Stay updated with the latest news and happenings in the
                        world of products, services, and more.
                    </p>

                    {/* Carousel Section */}
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        autoPlay
                        interval={1500}
                        className="animate-pulse rounded-3xl overflow-hidden ">
                        <div>
                            <img
                                src="projectimages/news/news1.png"
                                alt="News 1"
                                className="h-[480px] w-full object-cover transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            />
                        </div>
                        <div>
                            <img
                                src="projectimages/news/news2.jpg"
                                alt="News 2"
                                className="h-[480px] w-full object-cover transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            />
                        </div>
                        <div>
                            <img
                                src="projectimages/news/news3.jpg"
                                alt="News 3"
                                className="h-[480px] w-full object-cover transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            />
                        </div>
                    </Carousel>
                </div>

                {/* Right section (Free Delivery) */}
                <div className="col-span-1 mt-14">
                    {" "}
                    <h2 className="text-3xl font-bold mb-6">Free Delivery</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {freeDeliveryProducts
                            .slice(0, 4)
                            .map((product, index) => (
                                <div
                                    onClick={handleOpenModal}
                                    key={product.fd}
                                    className="mt-2 bg-gradient-to-r from-teal-400 to-lime-500 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300">
                                    <img
                                        src={product.image_url}
                                        alt={product.title}
                                        className="h-36 w-full object-cover rounded-t-lg"
                                    />
                                    <div className="p-4 bg-white bg-opacity-75">
                                        <h3 className="text-lg font-bold">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm">
                                            {product.price} taka
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Special Discounts */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-6">Special Discounts</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {discountedProducts.map((product) => (
                        <div
                            onClick={handleOpenModal}
                            key={product.discount_id}
                            className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300">
                            {console.log(product.image_url)}
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="h-48 w-full object-cover rounded-t-lg"
                            />
                            <div className="p-4 bg-white bg-opacity-75">
                                <h3 className="text-lg font-bold">
                                    {product.title}
                                </h3>
                                <p>{product.discountPercent}% off</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Categories */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-6">Product Categories</h2>
                <div className="flex space-x-8">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="text-center"
                            onClick={handleOpenModal}>
                            <div className="w-52 h-52 bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-lg shadow-lg hover:scale-110 transform transition-all duration-300">
                                <img
                                    src={category.category_image}
                                    alt={category.category_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="mt-2 text-lg font-semibold">
                                {category.category_name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shops */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-6">Shops</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {shops.map((shop, index) => (
                        <div
                            key={index}
                            className="text-center"
                            onClick={handleOpenModal}>
                            <div className="w-64 h-48 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg shadow-lg hover:scale-110 transform transition-all duration-300">
                                <img
                                    src={shop.shop_image}
                                    alt={shop.shop_name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <p className="mt-2 text-lg font-semibold">
                                {shop.shop_name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
