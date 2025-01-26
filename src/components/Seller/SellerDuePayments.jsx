import React, { useState, useEffect } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar.jsx";

const SellerDuePayments = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [duePayments, setDuePayments] = useState([]);

    useEffect(() => {
        const shopID = localStorage.getItem("shopID");
        if (shopID) {
            axios
                .get(`http://localhost:8081/due-payments/${shopID}`)
                .then((response) => {
                    setDuePayments(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching due payments:", error);
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Due Payments
                        </h1>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Payment ID
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Customer Name
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Amount (Taka)
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Due Date
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Partial Payment Amount
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Payment Reason
                                        </th>
                                        {/* <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Actions
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {duePayments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="py-2 px-4 border-b border-gray-200 text-center text-gray-700">
                                                No due payments available.
                                            </td>
                                        </tr>
                                    ) : (
                                        duePayments
                                            .filter(
                                                (payment) =>
                                                    payment.payment_status ===
                                                        "pending" ||
                                                    payment.payment_status ===
                                                        "partial"
                                            )
                                            .map((payment) => (
                                                <tr key={payment.due_id}>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {payment.due_id}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {payment.customer_name}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {payment.Amount} Taka
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {new Date(
                                                            payment.due_date
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {payment.payment_status}
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {
                                                            payment.partial_payment_amount
                                                        }{" "}
                                                        Taka
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-gray-200">
                                                        {payment.payment_reason}
                                                    </td>
                                                    {/* <td className="py-2 px-4 border-b border-gray-200">
                                                        <button className="bg-blue-500 text-white py-1 px-3 rounded-lg">
                                                            Show Order Items
                                                        </button>
                                                    </td> */}
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

export default SellerDuePayments;
