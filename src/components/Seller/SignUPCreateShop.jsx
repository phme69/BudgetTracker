import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
const SignUPCreateShop = () => {
    const [shopData, setShopData] = useState({
        shop_id: "",
        shop_name: "",
        area_code: "",
        area_name: "",
        full_address: "",
    });
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const shopId = localStorage.getItem("shopID");
        if (shopId) {
            setShopData((prevData) => ({
                ...prevData,
                shop_id: shopId,
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopData({
            ...shopData,
            [name]: value,
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImage(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("shop_id", shopData.shop_id); // Include shop_id
        formData.append("shop_name", shopData.shop_name);
        formData.append("area_code", shopData.area_code);
        formData.append("area_name", shopData.area_name);
        formData.append("full_address", shopData.full_address);

        if (image) {
            formData.append("image", image); // Append image if available
        }

        try {
            const response = await axios.post(
                "http://localhost:8081/shop/register",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setImageUrl(response.data.imageUrl); // Update image URL if returned
            alert("Shop registered successfully! Now you can go to home.");
            navigate("/seller-home"); // Navigate to seller home page
        } catch (error) {
            console.error("Error registering shop:", error);
            alert("Error registering shop. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <SellerNavbar />
            <main className="flex-grow container mx-auto p-8">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Create Shop
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700">Shop ID</label>
                        <input
                            type="text"
                            name="shop_id"
                            value={shopData.shop_id}
                            readOnly
                            className="w-full mt-2 p-2 border rounded bg-gray-200 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Shop Name</label>
                        <input
                            type="text"
                            name="shop_name"
                            value={shopData.shop_name}
                            onChange={handleChange}
                            className="w-full mt-2 p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Area Code</label>
                        <input
                            type="text"
                            name="area_code"
                            value={shopData.area_code}
                            onChange={handleChange}
                            className="w-full mt-2 p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Area Name</label>
                        <input
                            type="text"
                            name="area_name"
                            value={shopData.area_name}
                            onChange={handleChange}
                            className="w-full mt-2 p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Full Address
                        </label>
                        <textarea
                            name="full_address"
                            value={shopData.full_address}
                            onChange={handleChange}
                            className="w-full mt-2 p-2 border rounded"
                        />
                    </div>
                    <div
                        className="h-36 border-dashed border-2 border-gray-400 p-4 rounded-lg mb-4"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}>
                        <p className="text-center text-gray-500">
                            Drag and drop your shop image here, or click to
                            select a file
                        </p>
                        {image && (
                            <div className="mt-4 text-center">
                                <p>{image.name}</p>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
                        Register Shop
                    </button>
                </form>
            </main>
            <SellerFooter />
        </div>
    );
};

export default SignUPCreateShop;