import React, { useState, useEffect } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const SellerPendingOrders = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [pendingOrders, setPendingOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const shopID = localStorage.getItem("shopID");
        if (shopID) {
            axios
                .get(`http://localhost:8081/pending-orders/${shopID}`)
                .then((response) => {
                    setPendingOrders(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching pending orders:", error);
                });
        }
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleStatusChange = (orderId) => {
        setSelectedOrderId(orderId);
        setShowPopup(true);
    };

    const confirmStatusChange = () => {
        axios
            .put("http://localhost:8081/update-order-status", {
                order_id: selectedOrderId,
                status: "done",
            })
            .then((response) => {
                setPendingOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.order_id === selectedOrderId
                            ? { ...order, status: "done" }
                            : order
                    )
                );
                setShowPopup(false);
                setSelectedOrderId(null);
            })
            .catch((error) => {
                console.error("Error updating order status:", error);
                setShowPopup(false);
                setSelectedOrderId(null);
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Pending Orders
                        </h1>
                        <div className="h-[700px] overflow-y-auto space-y-4">
                            {pendingOrders.length === 0 ? (
                                <p className="text-gray-700">
                                    No pending orders.
                                </p>
                            ) : (
                                pendingOrders.map((order) => (
                                    <div
                                        key={order.order_id}
                                        className="p-4 bg-gray-100 rounded-lg shadow-md">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-semibold">
                                                Order ID: {order.order_id}
                                            </p>
                                            <p className="text-lg font-semibold">
                                                Total Price:{" "}
                                                {order.total_price.toFixed(2)}{" "}
                                                taka
                                            </p>
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() =>
                                                    toggleExpand(order.order_id)
                                                }>
                                                {expandedOrderId ===
                                                order.order_id
                                                    ? "Collapse"
                                                    : "Expand"}
                                            </button>
                                        </div>
                                        {expandedOrderId === order.order_id && (
                                            <div className="mt-2">
                                                <p className="text-gray-700">
                                                    Customer ID:{" "}
                                                    {order.customer_id}
                                                </p>
                                                <p className="text-gray-700">
                                                    Order Date:{" "}
                                                    {new Date(
                                                        order.order_date
                                                    ).toLocaleString()}
                                                </p>
                                                <p className="text-gray-700">
                                                    Status: {order.status}
                                                </p>
                                                {order.status === "pending" && (
                                                    <button
                                                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                order.order_id
                                                            )
                                                        }>
                                                        Mark as Done
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <SellerFooter />
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">
                            Confirm Status Change
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to mark this order as done?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                                onClick={() => setShowPopup(false)}>
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                onClick={confirmStatusChange}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SellerPendingOrders;
