import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerSideBar from "./CustomerSideBar";

const CustomerFavouriteShops = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex min-h-screen">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />
            <div className="flex-1 p-6 bg-gray-100">
                <FavouriteShopsHome />
            </div>
        </div>
    );
};

export default CustomerFavouriteShops;

const FavouriteShopsHome = () => {
    const [favouriteShops, setFavouriteShops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavouriteShops = async () => {
            const customerID = localStorage.getItem("customerID");
            if (!customerID) {
                console.error("Customer ID not found in local storage");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8081/customer/${customerID}/favourite-shops`
                );
                setFavouriteShops(response.data);
            } catch (error) {
                console.error("Error fetching favourite shops:", error);
            }
        };

        fetchFavouriteShops();
    }, []);

    const handleShopClick = (shopId) => {
        navigate(`/customer-to-shop/${shopId}`);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
                Favourite Shops
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favouriteShops.map((shop) => (
                    <div
                        key={shop.fs_id}
                        className="flex flex-col items-center justify-center w-80 h-60 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                        onClick={() => handleShopClick(shop.shop_id)}>
                        <img
                            src={shop.shop_image}
                            alt={shop.shop_name}
                            className="w-24 h-24 rounded-full mb-4 object-cover"
                        />
                        <span className="text-xl font-semibold text-gray-800">
                            {shop.shop_name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
