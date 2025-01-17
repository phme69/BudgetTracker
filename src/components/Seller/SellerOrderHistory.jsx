import React, { useState, useEffect } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const SellerOrderHistory = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const shopID = localStorage.getItem("shopID");
        if (shopID) {
            axios
                .get(`http://localhost:8081/order-history/${shopID}`)
                .then((response) => {
                    setOrderHistory(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching order history:", error);
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order History</h1>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Customer ID</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Total Price</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Order Date</th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-2 px-4 border-b border-gray-200 text-center text-gray-700">No order history available.</td>
                                        </tr>
                                    ) : (
                                        orderHistory.map((order) => (
                                            <tr key={order.order_id}>
                                                <td className="py-2 px-4 border-b border-gray-200">{order.order_id}</td>
                                                <td className="py-2 px-4 border-b border-gray-200">{order.customer_id}</td>
                                                <td className="py-2 px-4 border-b border-gray-200">{order.total_price.toFixed(2)} taka</td>
                                                <td className="py-2 px-4 border-b border-gray-200">{new Date(order.order_date).toLocaleString()}</td>
                                                <td className="py-2 px-4 border-b border-gray-200">{order.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerOrderHistory;