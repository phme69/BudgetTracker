import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [shops, setShops] = useState([]);

    useEffect(() => {
        // Fetch product categories
        axios
            .get("http://localhost:8081/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product categories:", error);
            });

        // Fetch shops
        fetchAllShops();
    }, []);

    const fetchAllShops = () => {
        axios
            .get("http://localhost:8081/shops")
            .then((response) => {
                setShops(response.data);
            })
            .catch((error) => {
                console.error("Error fetching shops:", error);
            });
    };

    return (
        <div className="bg-[#F6F4F0] min-h-screen p-6 font-sans">
            {/* Search Bar */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search for Product..."
                    className="w-3/4 p-4 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                />
                <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-r-full hover:from-blue-600 hover:to-blue-800">
                    🔍
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Special Offers & Discounts */}
                <div className="col-span-2">
                    <h2 className="text-2xl font-bold mb-6">
                        Special Offers & Discounts
                    </h2>
                    <div className="flex space-x-6">
                        <div className="w-1/3 h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg hover:scale-105 transform transition-all duration-300 overflow-hidden shadow-lg">
                            {/* Image Placeholder */}
                        </div>
                        <div className="w-1/3 h-48 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg hover:scale-105 transform transition-all duration-300 overflow-hidden shadow-lg">
                            {/* Image Placeholder */}
                        </div>
                        <div className="w-1/3 h-48 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg hover:scale-105 transform transition-all duration-300 overflow-hidden shadow-lg">
                            {/* Image Placeholder */}
                        </div>
                    </div>
                </div>

                {/* News & Updates */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">News & Updates</h2>
                    <div className="w-full h-48 bg-gradient-to-r from-yellow-300 to-orange-500 rounded-lg hover:scale-105 transform transition-all duration-300 overflow-hidden shadow-lg">
                        {/* Image Placeholder */}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">Product Category</h2>
                <div className="flex space-x-8">
                    {categories.map((category, index) => (
                        <div key={index} className="text-center">
                            <div className="w-52 h-52 mx-auto bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-lg hover:scale-110 transform transition-all duration-300 overflow-hidden shadow-lg">
                                <img
                                    src={category.category_image}
                                    alt={category.category_name}
                                    className="w-full h-full object-cover"
                                />
                                {/* {console.log(category.category_image)} */}
                            </div>
                            <p className="mt-2 text-lg font-semibold">
                                {category.category_name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shops */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">Shops</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {shops.map((shop, index) => (
                        <div key={index} className="text-center">
                            <div className="w-72 h-48 mx-auto bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg hover:scale-110 transform transition-all duration-300 overflow-hidden shadow-lg">
                                <img
                                    src={shop.shop_image}
                                    alt={shop.shop_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="mt-2 text-lg font-semibold">
                                {shop.shop_name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Free Delivery */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">Free Delivery</h2>
                <div className="flex space-x-8">
                    {Array(4)
                        .fill()
                        .map((_, index) => (
                            <div
                                key={index}
                                className="w-1/4 h-24 bg-gradient-to-r from-teal-400 to-lime-500 rounded-lg hover:scale-105 transform transition-all duration-300 overflow-hidden shadow-lg">
                                {/* Image Placeholder */}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
