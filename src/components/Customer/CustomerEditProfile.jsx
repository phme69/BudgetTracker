import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerNavBar from "./CustomerNavBar";
import CustomerSideBar from "./CustomerSideBar";
import CustomerFooter from "./CustomerFooter";

const CustomerEditProfile = () => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({
            ...customer,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const storedCustomerID = localStorage.getItem("customerID");
        axios
            .put(`http://localhost:8081/customer/${storedCustomerID}`, customer)
            .then((response) => {
                console.log("Customer information updated successfully:", response.data);
                // Handle success (e.g., show a success message or redirect)
                navigate("/customer-profile");
            })
            .catch((error) => {
                console.error("Error updating customer information:", error);
            });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-1">
                <CustomerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 p-6 bg-gray-100">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={customer.customer_name}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={customer.email}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={customer.username}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={customer.phone_number}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={customer.address}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Customer Level</label>
                                        <input
                                            type="number"
                                            name="customer_level"
                                            value={customer.customer_level}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Profile Image URL</label>
                                        <input
                                            type="text"
                                            name="customer_image"
                                            value={customer.customer_image}
                                            onChange={handleChange}
                                            className="w-full mt-2 p-2 border rounded"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerEditProfile;