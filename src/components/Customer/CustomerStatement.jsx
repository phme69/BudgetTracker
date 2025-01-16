import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSideBar from "./CustomerSideBar";

const CustomerStatement = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex min-h-screen">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />
            <div className="flex-1 p-6">
                <MonthlyStatement />
            </div>
        </div>
    );
};

export default CustomerStatement;

const rowsPerPage = 10;

const MonthlyStatement = () => {
    const [months, setMonths] = useState([]);
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageData, setPageData] = useState([]);
    const [statements, setStatements] = useState([]);

    useEffect(() => {
        const fetchMonths = async () => {
            const customerID = localStorage.getItem("customerID");
            if (!customerID) {
                console.error("Customer ID not found in local storage");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8081/customer/${customerID}/order-months`
                );
                setMonths(response.data);
                if (response.data.length > 0) {
                    setCurrentMonth(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching order months:", error);
            }
        };

        fetchMonths();
    }, []);

    useEffect(() => {
        const fetchStatements = async () => {
            const customerID = localStorage.getItem("customerID");
            if (!customerID) {
                console.error("Customer ID not found in local storage");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8081/customer/${customerID}/statements`
                );
                setStatements(response.data);
            } catch (error) {
                console.error("Error fetching statements:", error);
            }
        };

        fetchStatements();
    }, []);

    useEffect(() => {
        const monthData = statements.filter((statement) => {
            const month = new Date(statement.order_date)
                .toISOString()
                .slice(0, 7);
            return month === currentMonth;
        });
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPageData(monthData.slice(start, end));
    }, [currentMonth, currentPage, statements]);

    const handleMonthChange = (e) => {
        setCurrentMonth(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Selected Month:
                    </h3>
                    <select
                        id="month-selector"
                        value={currentMonth}
                        onChange={handleMonthChange}
                        className="px-4 py-2 border rounded-lg shadow focus:ring-blue-300">
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {new Date(month).toLocaleString("default", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-lg  mx-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                                <th className="px-4 py-2">Shop Name</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageData.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`border-b  ${
                                        index % 2 === 0
                                            ? "bg-gray-50"
                                            : "bg-white"
                                    }`}>
                                    <td className="px-4 py-2 text-gray-700 text-center">
                                        {row.shop_name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700 text-center">
                                        {new Date(
                                            row.order_date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td
                                        className={`px-4 py-2 font-bold text-center ${
                                            row.status === "done"
                                                ? "text-green-600"
                                                : "text-orange-500"
                                        }`}>
                                        {row.status}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700 text-center">
                                        {row.total_price} BDT
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-center space-x-2">
                    {Array.from({
                        length: Math.ceil(
                            statements.filter((statement) => {
                                const month = new Date(statement.order_date)
                                    .toISOString()
                                    .slice(0, 7);
                                return month === currentMonth;
                            }).length / rowsPerPage
                        ),
                    }).map((_, i) => (
                        <button
                            key={i}
                            className={`px-4 py-2 rounded-lg ${
                                i + 1 === currentPage
                                    ? "bg-blue-500 text-white"
                                    : "bg-white border text-blue-500"
                            } hover:bg-blue-100`}
                            onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                </div>

                <a
                    href="#customer-home"
                    className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    BACK
                </a>
            </div>
        </div>
    );
};

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CustomerSideBar from "./CustomerSideBar";

// const CustomerStatement = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     return (
//         <div className="flex min-h-screen">
//             <CustomerSideBar
//                 isCollapsed={isCollapsed}
//                 toggleCollapse={toggleCollapse}
//             />
//             <div className="flex-1 p-6">
//                 <MonthlyStatement />
//             </div>
//         </div>
//     );
// };

// export default CustomerStatement;

// const rowsPerPage = 10;

// const MonthlyStatement = () => {
//     const [months, setMonths] = useState([]);
//     const [currentMonth, setCurrentMonth] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageData, setPageData] = useState([]);
//     const [statements, setStatements] = useState([]);

//     useEffect(() => {
//         const fetchMonths = async () => {
//             const customerID = localStorage.getItem("customerID");
//             if (!customerID) {
//                 console.error("Customer ID not found in local storage");
//                 return;
//             }

//             try {
//                 const response = await axios.get(
//                     `http://localhost:8081/customer/${customerID}/order-months`
//                 );
//                 setMonths(response.data);
//                 if (response.data.length > 0) {
//                     setCurrentMonth(response.data[0]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching order months:", error);
//             }
//         };

//         fetchMonths();
//     }, []);

//     useEffect(() => {
//         const fetchStatements = async () => {
//             const customerID = localStorage.getItem("customerID");
//             if (!customerID) {
//                 console.error("Customer ID not found in local storage");
//                 return;
//             }

//             try {
//                 const response = await axios.get(
//                     `http://localhost:8081/customer/${customerID}/statements`
//                 );
//                 setStatements(response.data);
//             } catch (error) {
//                 console.error("Error fetching statements:", error);
//             }
//         };

//         fetchStatements();
//     }, []);

//     useEffect(() => {
//         const monthData = statements.filter((statement) => {
//             const month = new Date(statement.order_date)
//                 .toISOString()
//                 .slice(0, 7);
//             return month === currentMonth;
//         });
//         const start = (currentPage - 1) * rowsPerPage;
//         const end = start + rowsPerPage;
//         setPageData(monthData.slice(start, end));
//     }, [currentMonth, currentPage, statements]);

//     const handleMonthChange = (e) => {
//         setCurrentMonth(e.target.value);
//         setCurrentPage(1);
//     };

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold">Selected:</h3>
//                     <select
//                         id="month-selector"
//                         value={currentMonth}
//                         onChange={handleMonthChange}
//                         className="px-4 py-2 border rounded-lg">
//                         {months.map((month) => (
//                             <option key={month} value={month}>
//                                 {new Date(month).toLocaleString("default", {
//                                     month: "long",
//                                     year: "numeric",
//                                 })}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <table className="w-full bg-white rounded-lg shadow overflow-hidden">
//                     <thead>
//                         <tr className="bg-green-500 text-white">
//                             <th className="px-4 py-2">Shop Name</th>
//                             <th className="px-4 py-2">Date</th>
//                             <th className="px-4 py-2">Status</th>
//                             <th className="px-4 py-2">Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pageData.map((row, index) => (
//                             <tr key={index} className="border-b">
//                                 <td className="px-4 py-2">{row.shop_name}</td>
//                                 <td className="px-4 py-2">
//                                     {new Date(
//                                         row.order_date
//                                     ).toLocaleDateString()}
//                                 </td>
//                                 <td
//                                     className={`px-4 py-2 font-bold ${
//                                         row.status === "done"
//                                             ? "text-green-500"
//                                             : "text-red-500"
//                                     }`}>
//                                     {row.status}
//                                 </td>
//                                 <td className="px-4 py-2">
//                                     {row.total_price} BDT
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <div className="mt-4 flex justify-center space-x-2">
//                     {Array.from({
//                         length: Math.ceil(
//                             statements.filter((statement) => {
//                                 const month = new Date(statement.order_date)
//                                     .toISOString()
//                                     .slice(0, 7);
//                                 return month === currentMonth;
//                             }).length / rowsPerPage
//                         ),
//                     }).map((_, i) => (
//                         <button
//                             key={i}
//                             className={`px-4 py-2 rounded-lg ${
//                                 i + 1 === currentPage
//                                     ? "bg-green-500 text-white"
//                                     : "bg-white border"
//                             }`}
//                             onClick={() => handlePageChange(i + 1)}>
//                             {i + 1}
//                         </button>
//                     ))}
//                 </div>

//                 <a
//                     href="#customer-home"
//                     className="mt-6 inline-block bg-green-500 text-white px-6 py-2 rounded-lg">
//                     BACK
//                 </a>
//             </div>
//         </div>
//     );
// };
