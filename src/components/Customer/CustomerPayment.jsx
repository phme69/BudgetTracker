import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerPayment = ({
    isOpen,
    onClose,
    customerID,
    cartItems,
    selectedPayment,
}) => {
    const [customerInfo, setCustomerInfo] = useState([]);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [shopIds, setShopIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [loadingMessage, setLoadingMessage] = useState(""); // Add loading message state
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        if (customerID) {
            console.log("Fetching customer info for customerID:", customerID);
            axios
                .get(`http://localhost:8081/cusPay/fetch/${customerID}`)
                .then((response) => {
                    console.log("Customer info fetched:", response.data);
                    setCustomerInfo(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching customer info:", error);
                });
        }
    }, [customerID]);

    useEffect(() => {
        const fetchDeliveryCharges = async () => {
            let totalDeliveryCharge = 0;
            for (const item of cartItems) {
                try {
                    console.log(
                        "Fetching delivery status for productID:",
                        item.product_id
                    );
                    const response = await axios.get(
                        `http://localhost:8081/deliveryStatus/${item.product_id}`
                    );
                    const status = response.data.status;
                    console.log(
                        "Delivery status for productID",
                        item.product_id,
                        ":",
                        status
                    );
                    if (status === "no") {
                        totalDeliveryCharge += 50;
                    }
                } catch (error) {
                    console.error("Error fetching delivery status:", error);
                }
            }
            console.log(
                "Total delivery charges calculated:",
                totalDeliveryCharge
            );
            setDeliveryCharges(totalDeliveryCharge);
        };

        const fetchShopIds = async () => {
            const shopIdsSet = new Set();
            for (const item of cartItems) {
                try {
                    console.log(
                        "Fetching shop ID for productID:",
                        item.product_id
                    );
                    const response = await axios.get(
                        `http://localhost:8081/shopProducts/${item.product_id}`
                    );
                    console.log(
                        "Shop ID for productID",
                        item.product_id,
                        ":",
                        response.data.shop_id
                    );
                    shopIdsSet.add(response.data.shop_id);
                } catch (error) {
                    console.error("Error fetching shop ID for product:", error);
                }
            }
            const shopIdsArray = Array.from(shopIdsSet);
            console.log("Shop IDs fetched:", shopIdsArray);
            setShopIds(shopIdsArray);
        };

        fetchDeliveryCharges();
        fetchShopIds();
    }, [cartItems]);

    if (!isOpen) return null;

    const handlePayment = async () => {
        console.log("Payment method:", selectedPayment);
        setIsLoading(true); // Show loading screen
        setLoadingMessage("Processing Payment...");

        const totalAmount = calculateTotalAmount() + deliveryCharges;
        console.log("Total amount to be paid:", totalAmount);

        try {
            for (const shopId of shopIds) {
                console.log("Creating order for shopID:", shopId);
                // Create a new order
                const orderResponse = await axios.post(
                    "http://localhost:8081/orders",
                    {
                        shop_id: shopId,
                        customer_id: customerID,
                        total_price: totalAmount,
                        status:
                            selectedPayment === "Due Payment"
                                ? "pending"
                                : "done",
                    }
                );

                const orderId = orderResponse.data.order_id;
                console.log("Order created with orderID:", orderId);

                // Create order items
                console.log("Creating order items for orderID:", orderId);
                await axios.post("http://localhost:8081/orderItems", {
                    order_id: orderId,
                    items: cartItems.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                });

                if (selectedPayment === "Due Payment") {
                    // Create a new due payment
                    console.log("Creating due payment for shopID:", shopId);
                    await axios.post("http://localhost:8081/duePayment", {
                        shop_id: shopId,
                        customer_id: customerID,
                        amount: totalAmount,
                        due_date: new Date().toISOString().split("T")[0], // Today's date
                        payment_reason: `Order ID: ${orderId}`,
                        payment_status: "pending",
                    });

                    console.log(
                        "Due payment created successfully for shop ID:",
                        shopId
                    );
                } else if (
                    selectedPayment === "Cash" ||
                    selectedPayment === "Card"
                ) {
                    // Create a new statement
                    console.log("Creating statement for shopID:", shopId);
                    await axios.post("http://localhost:8081/statements", {
                        customer_id: customerID,
                        shop_id: shopId,
                        order_id: orderId,
                    });

                    console.log(
                        "Statement created successfully for shop ID:",
                        shopId
                    );

                    // Create a new due payment with status "paid"
                    console.log("Creating due payment for shopID:", shopId);
                    await axios.post("http://localhost:8081/duePayment", {
                        shop_id: shopId,
                        customer_id: customerID,
                        amount: totalAmount,
                        due_date: new Date().toISOString().split("T")[0], // Today's date
                        payment_reason: `Order ID: ${orderId}`,
                        payment_status: "paid",
                    });

                    console.log(
                        "Due payment created successfully for shop ID:",
                        shopId
                    );
                }
            }

            // Clear the cart for the customer
            console.log("Clearing cart for customerID:", customerID);
            await axios.delete(`http://localhost:8081/clearCart/${customerID}`);
            console.log(
                "Cart cleared successfully for customerID:",
                customerID
            );

            // Show success message and navigate to customer home page after 2 seconds
            setLoadingMessage("Your Order is sent to Seller!");
            setTimeout(() => {
                setIsLoading(false); // Hide loading screen
                navigate("/customer-home");
            }, 2000);
        } catch (error) {
            console.error(
                "Error creating due payment or clearing cart:",
                error
            );
            setIsLoading(false); // Hide loading screen in case of error
        }

        // Handle payment logic here
        console.log("Payment initiated with customer info:", customerInfo);
        console.log("Cart items:", cartItems);
        onClose();
    };

    const calculateTotalAmount = () => {
        const total = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        console.log("Calculated total amount:", total);
        return total;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            {isLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                    <div className="text-2xl font-bold">{loadingMessage}</div>
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Customer Info</h3>
                    <p>Name: {customerInfo.customer_name}</p>
                    <p>Email: {customerInfo.email}</p>
                    <p>Address: {customerInfo.address}</p>
                    <p>Phone: {customerInfo.phone_number}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Cart Items</h3>
                    {console.log("Cart items:", cartItems)}
                    {cartItems.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex justify-between">
                            <span>{item.title}</span>
                            <span>
                                {item.quantity} x Tk {item.price}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Total Amount</h3>
                    <p>Tk {calculateTotalAmount() + deliveryCharges}</p>
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handlePayment}>
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerPayment;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const CustomerPayment = ({
//     isOpen,
//     onClose,
//     customerID,
//     cartItems,
//     selectedPayment,
// }) => {
//     const [customerInfo, setCustomerInfo] = useState([]);
//     const [deliveryCharges, setDeliveryCharges] = useState(0);
//     const [shopIds, setShopIds] = useState([]);
//     const navigate = useNavigate(); // Initialize useNavigate

//     useEffect(() => {
//         if (customerID) {
//             console.log("Fetching customer info for customerID:", customerID);
//             axios
//                 .get(`http://localhost:8081/cusPay/fetch/${customerID}`)
//                 .then((response) => {
//                     console.log("Customer info fetched:", response.data);
//                     setCustomerInfo(response.data);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching customer info:", error);
//                 });
//         }
//     }, [customerID]);

//     useEffect(() => {
//         const fetchDeliveryCharges = async () => {
//             let totalDeliveryCharge = 0;
//             for (const item of cartItems) {
//                 try {
//                     console.log(
//                         "Fetching delivery status for productID:",
//                         item.product_id
//                     );
//                     const response = await axios.get(
//                         `http://localhost:8081/deliveryStatus/${item.product_id}`
//                     );
//                     const status = response.data.status;
//                     console.log(
//                         "Delivery status for productID",
//                         item.product_id,
//                         ":",
//                         status
//                     );
//                     if (status === "no") {
//                         totalDeliveryCharge += 50;
//                     }
//                 } catch (error) {
//                     console.error("Error fetching delivery status:", error);
//                 }
//             }
//             console.log(
//                 "Total delivery charges calculated:",
//                 totalDeliveryCharge
//             );
//             setDeliveryCharges(totalDeliveryCharge);
//         };

//         const fetchShopIds = async () => {
//             const shopIdsSet = new Set();
//             for (const item of cartItems) {
//                 try {
//                     console.log(
//                         "Fetching shop ID for productID:",
//                         item.product_id
//                     );
//                     const response = await axios.get(
//                         `http://localhost:8081/shopProducts/${item.product_id}`
//                     );
//                     console.log(
//                         "Shop ID for productID",
//                         item.product_id,
//                         ":",
//                         response.data.shop_id
//                     );
//                     shopIdsSet.add(response.data.shop_id);
//                 } catch (error) {
//                     console.error("Error fetching shop ID for product:", error);
//                 }
//             }
//             const shopIdsArray = Array.from(shopIdsSet);
//             console.log("Shop IDs fetched:", shopIdsArray);
//             setShopIds(shopIdsArray);
//         };

//         fetchDeliveryCharges();
//         fetchShopIds();
//     }, [cartItems]);

//     if (!isOpen) return null;

//     const handlePayment = async () => {
//         console.log("Payment method:", selectedPayment);

//         const totalAmount = calculateTotalAmount() + deliveryCharges;
//         console.log("Total amount to be paid:", totalAmount);

//         if (selectedPayment === "Due Payment") {
//             try {
//                 for (const shopId of shopIds) {
//                     console.log("Creating order for shopID:", shopId);
//                     // Create a new order
//                     const orderResponse = await axios.post(
//                         "http://localhost:8081/orders",
//                         {
//                             shop_id: shopId,
//                             customer_id: customerID,
//                             total_price: totalAmount,
//                         }
//                     );

//                     const orderId = orderResponse.data.order_id;
//                     console.log("Order created with orderID:", orderId);

//                     // Create order items
//                     console.log("Creating order items for orderID:", orderId);
//                     await axios.post("http://localhost:8081/orderItems", {
//                         order_id: orderId,
//                         items: cartItems.map((item) => ({
//                             product_id: item.product_id,
//                             quantity: item.quantity,
//                             price: item.price,
//                         })),
//                     });

//                     // Create a new due payment
//                     console.log("Creating due payment for shopID:", shopId);
//                     await axios.post("http://localhost:8081/duePayment", {
//                         shop_id: shopId,
//                         customer_id: customerID,
//                         amount: totalAmount,
//                         due_date: new Date().toISOString().split("T")[0], // Today's date
//                         payment_reason: `Order ID: ${orderId}`,
//                     });

//                     console.log(
//                         "Due payment created successfully for shop ID:",
//                         shopId
//                     );
//                 }

//                 // Clear the cart for the customer
//                 console.log("Clearing cart for customerID:", customerID);
//                 await axios.delete(
//                     `http://localhost:8081/clearCart/${customerID}`
//                 );
//                 console.log(
//                     "Cart cleared successfully for customerID:",
//                     customerID
//                 );

//                 // Navigate to customer home page
//                 navigate("/customer-home");
//             } catch (error) {
//                 console.error(
//                     "Error creating due payment or clearing cart:",
//                     error
//                 );
//             }
//         }

//         // Handle payment logic here
//         console.log("Payment initiated with customer info:", customerInfo);
//         console.log("Cart items:", cartItems);
//         onClose();
//     };

//     const calculateTotalAmount = () => {
//         const total = cartItems.reduce(
//             (total, item) => total + item.price * item.quantity,
//             0
//         );
//         console.log("Calculated total amount:", total);
//         return total;
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
//                 <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>
//                 <div className="mb-4">
//                     <h3 className="text-xl font-semibold">Customer Info</h3>
//                     <p>Name: {customerInfo.customer_name}</p>
//                     <p>Email: {customerInfo.email}</p>
//                     <p>Address: {customerInfo.address}</p>
//                     <p>Phone: {customerInfo.phone_number}</p>
//                 </div>
//                 <div className="mb-4">
//                     <h3 className="text-xl font-semibold">Cart Items</h3>
//                     {console.log("Cart items:", cartItems)}
//                     {cartItems.map((item) => (
//                         <div
//                             key={item.product_id}
//                             className="flex justify-between">
//                             <span>{item.title}</span>
//                             <span>
//                                 {item.quantity} x Tk {item.price}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="mb-4">
//                     <h3 className="text-xl font-semibold">Total Amount</h3>
//                     <p>Tk {calculateTotalAmount() + deliveryCharges}</p>
//                 </div>
//                 <div className="flex justify-end gap-4">
//                     <button
//                         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                         onClick={onClose}>
//                         Cancel
//                     </button>
//                     <button
//                         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                         onClick={handlePayment}>
//                         Confirm Payment
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CustomerPayment;
