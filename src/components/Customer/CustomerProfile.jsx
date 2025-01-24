import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerSideBar from "./CustomerSideBar";

const CustomerProfile = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [customer, setCustomer] = useState({
        customer_id: "",
        customer_level: "",
        customer_name: "",
        email: "",
        username: "",
        phone_number: "",
        address: "",
        customer_image: "",
    });

    useEffect(() => {
        const storedCustomerID = localStorage.getItem("customerID");
        if (storedCustomerID) {
            axios
                .get(`http://localhost:8081/customer/${storedCustomerID}`)
                .then((response) => {
                    setCustomer(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching customer information:",
                        error
                    );
                });
        }
    }, []);

    const handleEditClick = () => {
        navigate("/customer-edit-profile");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />
            <div className="flex-1 p-6">
                <div className="min-h-screen bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
                    {/* Top Section: Profile Image and Edit Button */}
                    <div className="flex items-center p-8 gap-8">
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={
                                    customer.customer_image ||
                                    "https://via.placeholder.com/150"
                                }
                                alt="Customer"
                                className="w-64 h-64 rounded-full border-4 border-blue-500 shadow-lg transform transition-transform duration-500 hover:scale-110"
                            />
                        </div>

                        {/* Customer Info */}
                        <div className="w-full">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleEditClick}
                                    className="text-white bg-blue-500 hover:bg-blue-700 rounded-full p-3 focus:outline-none focus:shadow-outline transform transition-transform duration-300 hover:scale-110">
                                    <i className="fas fa-edit text-xl"></i>
                                </button>
                            </div>
                            <div className="text-center mt-4 space-y-2">
                                <h2 className="text-4xl font-bold text-gray-800">
                                    {customer.customer_name}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {customer.email}
                                </p>
                                <p className="text-gray-600 text-lg">
                                    {customer.username}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Additional Info */}
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b-2  inline-block">
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Phone */}
                            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <p className="text-xl font-semibold text-gray-700">
                                    Phone
                                </p>
                                <p className="text-gray-600">
                                    {customer.phone_number}
                                </p>
                            </div>

                            {/* Address */}
                            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <p className="text-xl font-semibold text-gray-700">
                                    Address
                                </p>
                                <p className="text-gray-600">
                                    {customer.address}
                                </p>
                            </div>

                            {/* Level */}
                            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <p className="text-xl font-semibold text-gray-700">
                                    Level
                                </p>
                                <p className="text-gray-600">
                                    {customer.customer_level}
                                </p>
                            </div>
                        </div>
                        <h3 className="mt-4 text-2xl font-bold text-gray-800 mb-1 border-b-2 inline-block">
                            Description
                        </h3>
                        <textarea
                            className="w-full p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            rows="4"
                            placeholder="Additional Information">
                            Passionate customer with a love for unique products
                            and exceptional service.
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
