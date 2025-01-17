import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerProfileHover = ({ customer }) => {
    const [modalContent, setModalContent] = useState(null);

    const handleButtonClick = (content) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    return (
        <div className="relative">
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-4 text-center">
                    <img
                        src={
                            customer.customer_image ||
                            "/path/to/default-profile-image.jpg"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full mx-auto"
                    />
                    <p className="text-xl font-semibold">
                        {customer.customer_name}
                    </p>
                    <p className="text-gray-600">{customer.phone_number}</p>
                    <a
                        href="#customer-profile"
                        className="text-red-500 hover:underline mt-2 block">
                        Click to Get Info
                    </a>
                </div>
                <hr />
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Favourites")}>
                    Favourites
                </a>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Location")}>
                    Location
                </a>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Languages")}>
                    Languages
                </a>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Switch Account")}>
                    Switch Account
                </a>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Clear Cache")}>
                    Clear Cache
                </a>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Clear History")}>
                    Clear History
                </a>
                <a
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleButtonClick("Help")}>
                    Help
                </a>
            </div>

            {modalContent && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {modalContent}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-900 text-5xl">
                                &times;
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-96">
                            {getModalContent(modalContent)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getModalContent = (content) => {
    switch (content) {
        case "Favourites":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Favourites
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Here are your favourite items. Explore and enjoy your
                        top picks!
                    </p>
                </div>
            );

        case "Location":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Location
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Here is your current location information. Update as
                        needed!
                    </p>
                </div>
            );

        case "Languages":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Languages
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Choose your preferred language to enhance your
                        experience.
                    </p>
                </div>
            );

        case "Switch Account":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Switch Account
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Manage and switch between your accounts seamlessly.
                    </p>
                </div>
            );

        case "Clear Cache":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Clear Cache
                    </h2>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            localStorage.clear();
                            alert("Cache cleared successfully!");
                        }}>
                        Clear Cache
                    </button>
                </div>
            );

        case "Clear History":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Clear History
                    </h2>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => {
                            console.clear();
                            alert("History cleared successfully!");
                        }}>
                        Clear History
                    </button>
                </div>
            );

        case "Help":
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">Help</h2>
                    <p className="text-gray-600 mt-2">
                        Find answers to common questions and get support below:
                    </p>
                    <a
                        href="https://www.github.com/parvezhossainme"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Go to Help Center
                    </a>
                </div>
            );

        default:
            return (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Not Found
                    </h2>
                    <p className="text-gray-600 mt-2">
                        The content you are looking for is not available.
                    </p>
                </div>
            );
    }
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
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
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

    const handleMessagesClick = () => {
        navigate("/customer-messages");
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
                            href="#customer-messages"
                            onClick={handleMessagesClick}
                            className="text-gray-800 hover:text-white transition duration-300 transform hover:scale-105 hover:underline decoration-wavy underline-offset-4">
                            Messages
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
                        {showDropdown && (
                            <CustomerProfileHover customer={customer} />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CustomerNavBar;
