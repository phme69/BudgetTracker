import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar.jsx";
import axios from "axios";

const Sell = () => {
    const [pendingOrderCount, setPendingOrderCount] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [topDiscount, setTopDiscount] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);

    useEffect(() => {
        const shopID = localStorage.getItem("shopID") || "Unknown";
        console.log("From sell: " + shopID);
        const sellerName = localStorage.getItem("sellerName") || "Seller";
        console.log("From sell: " + sellerName);

        if (shopID !== "Unknown") {
            axios
                .get(`http://localhost:8081/pending-order-count/${shopID}`)
                .then((response) => {
                    console.log(response.data);
                    setPendingOrderCount(response.data.count);
                })
                .catch((error) => {
                    console.error("Error fetching pending order count:", error);
                });

            axios
                .get(`http://localhost:8081/total-sales/${shopID}`)
                .then((response) => {
                    console.log(response.data);
                    setTotalSales(response.data.total_sales || 0);
                })
                .catch((error) => {
                    console.error("Error fetching total sales amount:", error);
                });

            axios
                .get(`http://localhost:8081/low-stock-count/${shopID}`)
                .then((response) => {
                    console.log(response.data);
                    setLowStockCount(response.data.low_stock_count || 0);
                })
                .catch((error) => {
                    console.error("Error fetching low stock count:", error);
                });

            axios
                .get(`http://localhost:8081/top-discount/${shopID}`)
                .then((response) => {
                    console.log(response.data);
                    setTopDiscount(response.data.top_discount || 0);
                })
                .catch((error) => {
                    console.error("Error fetching top discount:", error);
                });

            axios
                .get(`http://localhost:8081/total-messages/${shopID}`)
                .then((response) => {
                    console.log(response.data);
                    setTotalMessages(response.data.total_messages || 0);
                })
                .catch((error) => {
                    console.error("Error fetching total messages:", error);
                });
        }
    }, []);

    const shopID = localStorage.getItem("shopID") || "Unknown";
    const sellerName = localStorage.getItem("sellerName") || "Seller";

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">
                        Welcome, {sellerName}
                    </h2>
                    <p className="text-gray-600">Seller ID: {shopID}</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Total Sales</h2>
                    <p className="text-gray-600">{totalSales} taka</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Pending Orders</h2>
                    <p className="text-gray-600">{pendingOrderCount}</p>
                </div>
                <div className="bg-red-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">
                        Low Stock Products
                    </h2>
                    <p className="text-gray-600">{lowStockCount}</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Messages</h2>
                    <p className="text-gray-600">{totalMessages} New</p>
                </div>
                <div className="bg-teal-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Current Discounts</h2>
                    <p className="text-gray-600">Up to {topDiscount}% off</p>
                </div>
            </div>
        </div>
    );
};

const ProductsLowStock = ({ shopID }) => {
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8081/low-stock-products",
                    {
                        params: { shop_id: shopID },
                    }
                );
                setLowStockProducts(response.data);
            } catch (error) {
                console.error("Error fetching low stock products:", error);
            }
        };

        if (shopID) {
            fetchLowStockProducts();
        }
    }, [shopID]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Products (LOW STOCK)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                        <div
                            key={product.shop_product_id}
                            className="border p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">
                                {product.title}
                            </h3>
                            <p className="text-gray-700">
                                Stock: {product.stock}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No low stock products available.</p>
                )}
            </div>
        </div>
    );
};

const CurrentDiscounts = ({ shopID }) => {
    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8081/top-discounted-products",
                    {
                        params: { shop_id: shopID },
                    }
                );
                setDiscounts(response.data);
            } catch (error) {
                console.error("Error fetching discounted products:", error);
            }
        };

        if (shopID) {
            fetchDiscounts();
        }
    }, [shopID]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Current Discounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {discounts.length > 0 ? (
                    discounts.map((discount) => (
                        <div
                            key={discount.discount_id}
                            className="border p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">
                                {discount.title}
                            </h3>
                            <p className="text-gray-700">
                                {discount.discountPercent}% off
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No current discounts available.</p>
                )}
            </div>
        </div>
    );
};

const NotificationsAlerts = ({ shopID }) => {
    const [reports, setReports] = useState([]);
    const [expandedReportId, setExpandedReportId] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                console.log(`Fetching reports for shop_id: ${shopID}`);
                const response = await axios.get(
                    "http://localhost:8081/sellerhome-reports",
                    {
                        params: { shop_id: shopID },
                    }
                );
                console.log("Fetched reports:", response.data);
                setReports(response.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        if (shopID) {
            fetchReports();
        }
    }, [shopID]);

    const toggleExpand = (reportId) => {
        setExpandedReportId(expandedReportId === reportId ? null : reportId);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-bold mb-4">Notifications & Alerts</h2>
            <ul className="space-y-2">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <li
                            key={report.report_id}
                            className="border-b border-gray-200 pb-2 mb-2">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Report ID:
                                    </span>{" "}
                                    {report.report_id}
                                </p>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() =>
                                        toggleExpand(report.report_id)
                                    }>
                                    {expandedReportId === report.report_id
                                        ? "Collapse"
                                        : "Expand"}
                                </button>
                            </div>
                            {expandedReportId === report.report_id && (
                                <div className="mt-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Due ID:
                                        </span>{" "}
                                        {report.due_id}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Reported By:
                                        </span>{" "}
                                        {report.reported_by}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Reason:
                                        </span>{" "}
                                        {report.report_reason}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Date:
                                        </span>{" "}
                                        {new Date(
                                            report.report_date
                                        ).toLocaleString()}
                                    </p>
                                    <p
                                        className={`text-gray-700 ${
                                            report.status === "pending"
                                                ? "text-red-500"
                                                : report.status === "reviewed"
                                                ? "text-yellow-500"
                                                : "text-green-500"
                                        }`}>
                                        <span className="font-semibold">
                                            Status:
                                        </span>{" "}
                                        {report.status}
                                    </p>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No notifications or alerts.</li>
                )}
            </ul>
        </div>
    );
};

const SellerHome = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state || {};
    const { shopID: locationshopID, name: locationsellerName } = locationState;

    useEffect(() => {
        if (locationshopID && locationsellerName) {
            localStorage.setItem("shopID", locationshopID);
            localStorage.setItem("sellerName", locationsellerName);
        }
    }, [locationshopID, locationsellerName]);

    const shopID = localStorage.getItem("shopID") || "Unknown";
    const sellerName = localStorage.getItem("sellerName") || "Seller";
    const [shopName, setShopName] = useState(localStorage.getItem("shopName"));

    useEffect(() => {
        if (shopID !== "Unknown") {
            axios
                .get(`http://localhost:8081/create-shop/${shopID}`)
                .then((response) => {
                    const shopName = response.data.shop_name;
                    setShopName(shopName);
                    localStorage.setItem("shopName", shopName);
                    console.log("Created shop : " + shopName);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        alert(
                            "Shop not found. Redirecting to shop creation page."
                        );
                        navigate("/seller-signup-create-shop");
                    } else {
                        console.error("Error fetching shop details:", error);
                    }
                });
        }
    }, [shopID, navigate]);

    useEffect(() => {
        if (!shopName) {
            alert("Shop not created. Redirecting to shop creation page.");
            navigate("/seller-signup-create-shop");
        }
    }, [shopName, navigate]);

    console.log("SellerHome received:", { shopID, sellerName, shopName }); // Debugging line

    return (
        <>
            <SellerNavbar />
            <div className="flex">
                <SellerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
                    <Sell />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <div className="space-y-8">
                            <ProductsLowStock shopID={shopID} />
                        </div>
                        <div className="space-y-8">
                            <CurrentDiscounts shopID={shopID} />
                        </div>
                    </div>
                    <div className="flex-1 py-5 bg-gray-100">
                        <NotificationsAlerts shopID={shopID} />
                    </div>
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerHome;
