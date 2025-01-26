
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CustomerSideBar from "./CustomerSideBar";

// const CustomerDue = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     return (
//         <div className="flex min-h-screen">
//             <CustomerSideBar
//                 isCollapsed={isCollapsed}
//                 toggleCollapse={toggleCollapse}
//             />
//             <div className="flex-1 p-6 bg-gray-100">
//                 <CDueHome />
//             </div>
//         </div>
//     );
// };

// export default CustomerDue;

// const CDueHome = () => {
//     const [selectedShop, setSelectedShop] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [dueData, setDueData] = useState({});
//     const [totalDue, setTotalDue] = useState(0);
//     const [isReportPopupVisible, setIsReportPopupVisible] = useState(false);
//     const [reportReason, setReportReason] = useState("");
//     const [selectedDueId, setSelectedDueId] = useState(null);

//     useEffect(() => {
//         const fetchDuePayments = async () => {
//             const customerID = localStorage.getItem("customerID");
//             if (!customerID) {
//                 console.error("Customer ID not found in local storage");
//                 return;
//             }

//             try {
//                 const response = await axios.get(
//                     `http://localhost:8081/customer/${customerID}/due-payments`
//                 );
//                 const data = response.data;

//                 const formattedData = data.reduce((acc, payment) => {
//                     if (!acc[payment.shop_name]) {
//                         acc[payment.shop_name] = [];
//                     }
//                     acc[payment.shop_name].push({
//                         item: payment.item || "N/A", // Assuming item is not available in the table
//                         amount: payment.Amount,
//                         date: payment.due_date,
//                         paymentStatus: payment.payment_status,
//                         paymentReason: payment.payment_reason,
//                         partialPayment: payment.partial_payment_amount,
//                         due_id: payment.due_id, // Assuming due_id is available in the table
//                     });
//                     return acc;
//                 }, {});

//                 setDueData(formattedData);

//                 const total = data.reduce(
//                     (acc, payment) => acc + payment.Amount,
//                     0
//                 );
//                 setTotalDue(total);
//             } catch (error) {
//                 console.error("Error fetching due payments:", error);
//             }
//         };

//         fetchDuePayments();
//     }, []);

//     const showDueList = (shopName) => {
//         setSelectedShop(shopName);
//     };

//     const hideDueList = () => {
//         setSelectedShop(null);
//     };

//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => setIsModalOpen(false);

//     const handleReportClick = (due_id) => {
//         setSelectedDueId(due_id);
//         setIsReportPopupVisible(true);
//     };

//     const handleReportSubmit = async () => {
//         const customerID = localStorage.getItem("customerID");
//         if (!customerID) {
//             console.error("Customer ID not found in local storage");
//             return;
//         }

//         try {
//             await axios.post("http://localhost:8081/report", {
//                 due_id: selectedDueId,
//                 reported_by: customerID,
//                 report_reason: reportReason,
//             });
//             setIsReportPopupVisible(false);
//             setReportReason("");
//             alert("Report submitted successfully");
//         } catch (error) {
//             console.error("Error submitting report:", error);
//             alert("Error submitting report");
//         }
//     };

//     return (
//         <div className="min-h-screen w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-4xl font-extrabold text-gray-800">Due</h1>
//                 <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
//                     Total Due: {totalDue} BDT
//                 </div>
//             </div>
//             {selectedShop ? (
//                 <div className="due-list-container">
//                     <h3 className="text-2xl font-bold mb-4">
//                         Due List for {selectedShop}
//                     </h3>
//                     <table className="w-full border-collapse">
//                         <thead>
//                             <tr>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Item
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Amount
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Status
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Partial Payment
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Reason
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Error
//                                 </th>
//                                 <th className="border px-4 py-2 bg-blue-600 text-white">
//                                     Action
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {dueData[selectedShop].map((due, index) => (
//                                 <tr key={index}>
//                                     <td className="border px-4 py-2">
//                                         {due.item}
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         {due.amount} BDT
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         {due.date}
//                                     </td>
//                                     <td
//                                         className={`border px-4 py-2 ${
//                                             due.paymentStatus === "paid"
//                                                 ? "text-green-500"
//                                                 : due.paymentStatus ===
//                                                   "partial"
//                                                 ? "text-yellow-500"
//                                                 : "text-red-500"
//                                         }`}>
//                                         {due.paymentStatus}
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         {due.partialPayment} BDT
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         {due.paymentReason || "N/A"}
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         <button
//                                             className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-400 transition duration-300"
//                                             onClick={() =>
//                                                 handleReportClick(due.due_id)
//                                             }>
//                                             Report
//                                         </button>
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-400 transition duration-300">
//                                             Pay Now
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <button
//                         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//                         onClick={hideDueList}>
//                         ← Back to Shops
//                     </button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {Object.keys(dueData).map((shop, index) => (
//                         <div
//                             key={index}
//                             className="flex flex-col items-center justify-center w-80 h-60 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
//                             <span className="text-xl font-semibold text-gray-800">
//                                 {shop}
//                             </span>
//                             <span className="text-lg text-gray-600 mt-2">
//                                 Due:{" "}
//                                 {dueData[shop].reduce(
//                                     (acc, due) => acc + due.amount,
//                                     0
//                                 )}{" "}
//                                 BDT
//                             </span>
//                             <div className="flex flex-col mt-4 space-y-2">
//                                 <button
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
//                                     onClick={() => showDueList(shop)}>
//                                     Show Due Details
//                                 </button>
//                                 <button
//                                     className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
//                                     onClick={openModal}>
//                                     Payment Now
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//                         <h2 className="text-2xl font-bold mb-4">
//                             Payment Confirmation
//                         </h2>
//                         <p className="text-gray-700 mb-6">
//                             Are you sure you want to make the payment?
//                         </p>
//                         <div className="flex justify-between">
//                             <button
//                                 className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
//                                 onClick={closeModal}>
//                                 Close
//                             </button>
//                             <button
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//                                 onClick={closeModal}>
//                                 Click to Pay
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Popup */}
//             {isReportPopupVisible && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//                         <h2 className="text-2xl font-bold mb-4">
//                             Report Issue
//                         </h2>
//                         <textarea
//                             className="w-full p-2 border rounded"
//                             placeholder="Enter report reason"
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                         />
//                         <div className="mt-4 flex justify-end">
//                             <button
//                                 className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
//                                 onClick={() => setIsReportPopupVisible(false)}>
//                                 Cancel
//                             </button>
//                             <button
//                                 className="bg-blue-500 text-white py-2 px-4 rounded"
//                                 onClick={handleReportSubmit}>
//                                 Submit
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import CustomerSideBar from "./CustomerSideBar";

// // const CustomerDue = () => {
// //     const [isCollapsed, setIsCollapsed] = useState(false);
// //     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

// //     return (
// //         <div className="flex min-h-screen">
// //             <CustomerSideBar
// //                 isCollapsed={isCollapsed}
// //                 toggleCollapse={toggleCollapse}
// //             />
// //             <div className="flex-1 p-6 bg-gray-100">
// //                 <CDueHome />
// //             </div>
// //         </div>
// //     );
// // };

// // export default CustomerDue;

// // const CDueHome = () => {
// //     const [selectedShop, setSelectedShop] = useState(null);
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [dueData, setDueData] = useState({});
// //     const [totalDue, setTotalDue] = useState(0);

// //     useEffect(() => {
// //         const fetchDuePayments = async () => {
// //             const customerID = localStorage.getItem("customerID");
// //             if (!customerID) {
// //                 console.error("Customer ID not found in local storage");
// //                 return;
// //             }

// //             try {
// //                 const response = await axios.get(
// //                     `http://localhost:8081/customer/${customerID}/due-payments`
// //                 );
// //                 const data = response.data;

// //                 const formattedData = data.reduce((acc, payment) => {
// //                     if (!acc[payment.shop_name]) {
// //                         acc[payment.shop_name] = [];
// //                     }
// //                     acc[payment.shop_name].push({
// //                         item: payment.item || "N/A", // Assuming item is not available in the table
// //                         amount: payment.Amount,
// //                         date: payment.due_date,
// //                         paymentStatus: payment.payment_status,
// //                         paymentReason: payment.payment_reason,
// //                         partialPayment: payment.partial_payment_amount,
// //                     });
// //                     return acc;
// //                 }, {});

// //                 setDueData(formattedData);

// //                 const total = data.reduce(
// //                     (acc, payment) => acc + payment.Amount,
// //                     0
// //                 );
// //                 setTotalDue(total);
// //             } catch (error) {
// //                 console.error("Error fetching due payments:", error);
// //             }
// //         };

// //         fetchDuePayments();
// //     }, []);

// //     const showDueList = (shopName) => {
// //         setSelectedShop(shopName);
// //     };

// //     const hideDueList = () => {
// //         setSelectedShop(null);
// //     };

// //     const openModal = () => setIsModalOpen(true);
// //     const closeModal = () => setIsModalOpen(false);

// //     return (
// //         <div className="min-h-screen w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
// //             <div className="flex items-center justify-between mb-6">
// //                 <h1 className="text-4xl font-extrabold text-gray-800">Due</h1>
// //                 <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
// //                     Total Due: {totalDue} BDT
// //                 </div>
// //             </div>
// //             {selectedShop ? (
// //                 <div className="due-list-container">
// //                     <h3 className="text-2xl font-bold mb-4">
// //                         Due List for {selectedShop}
// //                     </h3>
// //                     <table className="w-full border-collapse">
// //                         <thead>
// //                             <tr>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Item
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Amount
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Date
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Status
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Partial Payment
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Reason
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Error
// //                                 </th>
// //                                 <th className="border px-4 py-2 bg-blue-600 text-white">
// //                                     Action
// //                                 </th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {dueData[selectedShop].map((due, index) => (
// //                                 <tr key={index}>
// //                                     <td className="border px-4 py-2">
// //                                         {due.item}
// //                                     </td>
// //                                     <td className="border px-4 py-2">
// //                                         {due.amount} BDT
// //                                     </td>
// //                                     <td className="border px-4 py-2">
// //                                         {due.date}
// //                                     </td>
// //                                     <td
// //                                         className={`border px-4 py-2 ${
// //                                             due.paymentStatus === "paid"
// //                                                 ? "text-green-500"
// //                                                 : due.paymentStatus ===
// //                                                   "partial"
// //                                                 ? "text-yellow-500"
// //                                                 : "text-red-500"
// //                                         }`}>
// //                                         {due.paymentStatus}
// //                                     </td>
// //                                     <td className="border px-4 py-2">
// //                                         {due.partialPayment} BDT
// //                                     </td>
// //                                     <td className="border px-4 py-2">
// //                                         {due.paymentReason || "N/A"}
// //                                     </td>
// //                                     <td className="border px-4 py-2">
// //                                         <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-400 transition duration-300">
// //                                             Report
// //                                         </button>
// //                                     </td>
// //                                     <td className="border px-4 py-2">
// //                                         <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-400 transition duration-300">
// //                                             Pay Now
// //                                         </button>
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                     <button
// //                         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
// //                         onClick={hideDueList}>
// //                         ← Back to Shops
// //                     </button>
// //                 </div>
// //             ) : (
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {Object.keys(dueData).map((shop, index) => (
// //                         <div
// //                             key={index}
// //                             className="flex flex-col items-center justify-center w-80 h-60 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
// //                             <span className="text-xl font-semibold text-gray-800">
// //                                 {shop}
// //                             </span>
// //                             <span className="text-lg text-gray-600 mt-2">
// //                                 Due:{" "}
// //                                 {dueData[shop].reduce(
// //                                     (acc, due) => acc + due.amount,
// //                                     0
// //                                 )}{" "}
// //                                 BDT
// //                             </span>
// //                             <div className="flex flex-col mt-4 space-y-2">
// //                                 <button
// //                                     className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
// //                                     onClick={() => showDueList(shop)}>
// //                                     Show Due Details
// //                                 </button>
// //                                 <button
// //                                     className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
// //                                     onClick={openModal}>
// //                                     Payment Now
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}

// //             {isModalOpen && (
// //                 <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
// //                     <div className="bg-white rounded-lg shadow-lg p-6 w-96">
// //                         <h2 className="text-2xl font-bold mb-4">
// //                             Payment Confirmation
// //                         </h2>
// //                         <p className="text-gray-700 mb-6">
// //                             Are you sure you want to make the payment?
// //                         </p>
// //                         <div className="flex justify-between">
// //                             <button
// //                                 className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
// //                                 onClick={closeModal}>
// //                                 Close
// //                             </button>
// //                             <button
// //                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
// //                                 onClick={closeModal}>
// //                                 Click to Pay
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };
