import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerProfileHover = ({ customer }) => {
    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
            <div className="p-4 text-center">
                <img
                    src={customer.customer_image || '/path/to/default-profile-image.jpg'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mx-auto"
                />
                <p className="text-xl font-semibold">{customer.customer_name}</p>
                <p className="text-gray-600">{customer.phone_number}</p>
                <a href="#customer-profile" className="text-red-500 hover:underline mt-2 block" >
                    Click to Get Info
                </a>
            </div>
            <hr />
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Favourites</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Location</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Languages</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Switch Account</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Clear Cache</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Clear History</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Help</a>
        </div>
    );
};

const CustomerNavBar = () => {
    const [customer, setCustomer] = useState({
        customer_image: "",
        customer_name: "",
        phone_number: "",
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

    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null); // for outside clikingssss
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleHomeClick = () => {
        navigate("/customer-home");
    };

    const handleRidersClick = () => {
        navigate("/customer-riders");
    };

    const handleNotificationsClick = () => {
        navigate("/customer-notifications");
    };

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    const customerAddCart = () => {
        navigate("/customer-cart");
    };

    return (
        <nav className="bg-[#79D7BE] text-gray-800 p-4 shadow-lg border-b-4 border-gray-300">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        Budget Tracker
                    </h1>
                    <div className="flex space-x-6">
                        <a
                            href="#customer-home"
                            onClick={handleHomeClick}
                            className="text-gray-800 hover:text-white transition duration-300 transform hover:scale-105 hover:underline decoration-wavy underline-offset-4">
                            Home
                        </a>
                        <a
                            href="#customer-blogs"
                            onClick={handleRidersClick}
                            className="text-gray-800 hover:text-white transition duration-300 transform hover:scale-105 hover:underline decoration-wavy underline-offset-4">
                            Blogs
                        </a>
                        <a
                            href="#customer-notifications"
                            onClick={handleNotificationsClick}
                            className="text-gray-800 hover:text-white transition duration-300 transform hover:scale-105 hover:underline decoration-wavy underline-offset-4">
                            Notifications
                        </a>
                    </div>
                </div>
                <div className="search-bar hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-1/2">
                    <select className="bg-transparent border-none text-gray-600 focus:outline-none">
                        <option>All Categories</option>
                        <option>Groceries</option>
                        <option>Drinks</option>
                        <option>Chocolates</option>
                    </select>
                    <input
                        type="text"
                        className="bg-transparent border-none ml-4 focus:outline-none w-full"
                        placeholder="Search for products"
                    />
                </div>
                <div className="flex items-center justify-end space-x-4 gap-2">
                    <i
                        className="fas fa-shopping-cart text-4xl text-gray-800 cursor-pointer"
                        onClick={customerAddCart}></i>
                    <div className="relative" ref={dropdownRef}>
                        <img
                            src={
                                customer.customer_image ||
                                "/path/to/default-profile-image.jpg"
                            }
                            alt="Profile"
                            className="w-12 h-12 rounded-full cursor-pointer"
                            onMouseDown={handleProfileClick}
                        />
                        {showDropdown && <CustomerProfileHover customer={customer} />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CustomerNavBar;