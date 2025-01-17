import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const SellerProfile = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [seller, setSeller] = useState({
        shop_id: "",
        seller_name: "",
        email: "",
        phone_number: "",
        address: "",
        seller_image: "",
    });

    useEffect(() => {
        const storedShopID = localStorage.getItem("shopID");
        if (storedShopID) {
            axios
                .get(`http://localhost:8081/seller/${storedShopID}`)
                .then((response) => {
                    console.log(response.data);
                    setSeller(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching seller information:",
                        error
                    );
                });
        }
    }, []);

    return (
        <>
            <SellerNavbar />
            <div className="flex">
                <SellerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
                    <div className="min-h-screen mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
                        <div className="flex items-center space-x-6 mb-6 w-full">
                            {/* Profile Image */}
                            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                                {seller.seller_image ? (
                                    <img
                                        src={seller.seller_image}
                                        alt="Seller"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-gray-700 text-2xl">
                                        S
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {seller.seller_name}
                                </h1>
                                <p className="text-gray-600">
                                    Shop ID: {seller.shop_id}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-4">
                                    Contact Information
                                </h2>
                                <p className="text-gray-700">
                                    Email: {seller.email}
                                </p>
                                <p className="text-gray-700">
                                    Phone: {seller.phone_number || "N/A"}
                                </p>
                            </div>
                            {/* Business Information */}
                            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-4">
                                    Business Information
                                </h2>
                                <p className="text-gray-700">
                                    Address: {seller.address || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerProfile;