import React, { useState, useEffect } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const SellerPendingOrders = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [pendingOrders, setPendingOrders] = useState([]);

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Orders</h1>
                        <div className="space-y-4">
                            {pendingOrders.length === 0 ? (
                                <p className="text-gray-700">No pending orders.</p>
                            ) : (
                                pendingOrders.map((order) => (
                                    <div key={order.order_id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                        <p className="text-lg font-semibold">Order ID: {order.order_id}</p>
                                        <p className="text-gray-700">Customer ID: {order.customer_id}</p>
                                        <p className="text-gray-700">Order Date: {new Date(order.order_date).toLocaleString()}</p>
                                        <p className="text-gray-700">Total Price: {order.total_price.toFixed(2)} taka </p>
                                        <p className="text-gray-700">Status: {order.status}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerPendingOrders;

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import SellerNavbar from "./SellerNavbar";
// import SellerFooter from "./SellerFooter";
// import SellerSideBar from "./SellerSideBar";

// const SellerPendingOrders = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     const location = useLocation();
//     const locationState = location.state || {};
//     const { shopID: locationSellerId, name: locationName } = locationState;

//     useEffect(() => {
//         if (locationSellerId && locationName) {
//             localStorage.setItem("shopID", locationSellerId);
//             localStorage.setItem("name", locationName);
//         }
//     }, [locationSellerId, locationName]);

//     const shopID = localStorage.getItem("shopID") || "Unknown";
//     const name = localStorage.getItem("name") || "Seller";

//     console.log("SellerPendingOrders received:", { shopID, name }); // Debugging line

//     return (
//         <>
//             <SellerNavbar />
//             <div className="flex">
//                 <SellerSideBar
//                     isCollapsed={isCollapsed}
//                     toggleCollapse={toggleCollapse}
//                 />
//                 <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
//                     <div className="bg-white shadow-md rounded-lg p-6 w-full">
//                         <h2 className="text-2xl font-bold mb-4 text-center">Pending Orders</h2>
//                         {/* Pending orders content will go here */}
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full bg-white">
//                                 <thead>
//                                     <tr>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Order ID</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Customer Name</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Product</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Quantity</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Total Price</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Order Date</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Status</th>
//                                         <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {/* Pending order rows will go here */}
//                                     <tr>
//                                         <td className="py-2 px-4 border-b border-gray-200">12345</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">Parvez Hossain</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">Product 1</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">2</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">200 Tk</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">2025-01-01</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">Pending</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">
//                                             <button className="bg-green-500 text-white py-1 px-3 rounded-lg">Approve</button>
//                                             <button className="bg-red-500 text-white py-1 px-3 rounded-lg ml-2">Reject</button>
//                                         </td>
//                                     </tr>
//                                     {/* Add more rows as needed */}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <SellerFooter />
//         </>
//     );
// };

// export default SellerPendingOrders;