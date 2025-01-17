import React, { useState, useEffect } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const SellerSetDiscounts = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [discount, setDiscount] = useState('');

    useEffect(() => {
        
        // Fetch products for the shop
        const shopID = localStorage.getItem("shopID");
        if (shopID) {
            axios
                .get(`http://localhost:8081/shop-products/${shopID}`)
                .then((response) => {
                    setProducts(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching shop products:", error);
                });
        }
    }, []);

    const handleSetDiscount = () => {
        const shopID = localStorage.getItem("shopID");
        if (!shopID || !selectedProduct || !discount) {
            alert("Please fill in all fields.");
            return;
        }

        axios
            .post("http://localhost:8081/set-discount", {
                shop_id: shopID,
                product_id: selectedProduct,
                discountPercent: discount,
            })
            .then((response) => {
                alert("Discount set successfully!");
                setSelectedProduct('');
                setDiscount('');
            })
            .catch((error) => {
                console.error("Error setting discount:", error);
                alert("Failed to set discount.");
            });
    };

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Set Discounts</h1>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Product</label>
                                <select
                                    className="w-full border-gray-300 rounded-lg p-2"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(product => (
                                        <option key={product.product_id} value={product.product_id}>
                                            {product.product_id} - {product.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Discount (%)</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg p-2"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg"
                                    onClick={() => {
                                        setSelectedProduct('');
                                        setDiscount('');
                                    }}
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="button"
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                    onClick={handleSetDiscount}
                                >
                                    SET DISCOUNT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerSetDiscounts;