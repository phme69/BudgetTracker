import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerSideBar from "./CustomerSideBar";
import CustomerPayment from "./CustomerPayment";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CustomerCart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [customerID, setCustomerID] = useState(
        localStorage.getItem("customerID")
    );

    useEffect(() => {
        // Fetch cart items
        if (customerID) {
            axios
                .get(`http://localhost:8081/cart/${customerID}`)
                .then((response) => {
                    setCartItems(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching cart items:", error);
                });
        } else {
            console.error("Customer ID not found in localStorage");
        }
    }, [customerID]);

    const handleQuantityChange = (productId, quantity) => {
        if (customerID) {
            axios
                .put(`http://localhost:8081/cart`, {
                    customer_id: customerID,
                    product_id: productId,
                    quantity,
                })
                .then((response) => {
                    setCartItems(
                        cartItems.map((item) =>
                            item.product_id === productId
                                ? { ...item, quantity }
                                : item
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error updating cart item quantity:", error);
                });
        } else {
            console.error("Customer ID not found in localStorage");
        }
    };

    const handleRemoveItem = (productId) => {
        if (customerID) {
            axios
                .delete(`http://localhost:8081/cart`, {
                    data: { customer_id: customerID, product_id: productId },
                })
                .then((response) => {
                    setCartItems(
                        cartItems.filter(
                            (item) => item.product_id !== productId
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error removing cart item:", error);
                });
        } else {
            console.error("Customer ID not found in localStorage");
        }
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    // Order
    const [selectedPayment, setSelectedPayment] = useState("None");

    const selectPayment = (method) => {
        setSelectedPayment(method);
    };

    const submitOrder = () => {
        if (selectedPayment === "None") {
            alert("Please select a payment method.");
            return;
        }

        // Open the payment modal
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />
            <div className="flex-1 p-8">
                <header className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white text-center py-4 sticky top-0 z-10 shadow-md transform hover:scale-105 transition-all">
                    <h1 className="text-3xl font-bold">Your Cart</h1>
                </header>
                <div className="container mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-700">
                            Your cart is empty.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4 py-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-y-110 hover:shadow-xl hover:bg-gradient-to-r from-green-400 to-green-200 p-4">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover transition-all transform hover:scale-110 rounded-md"
                                    />
                                    <div className="flex-1 px-4">
                                        <h3 className="text-lg font-bold">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.product_id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l transition-transform transform hover:bg-gray-400"
                                                disabled={item.quantity <= 1}>
                                                -
                                            </button>
                                            <input
                                                type="text"
                                                value={item.quantity}
                                                readOnly
                                                className="w-12 text-center border-t border-b border-gray-300"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.product_id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r transition-transform transform hover:bg-gray-400">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800 px-4">
                                        Tk {item.price}
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleRemoveItem(item.product_id)
                                        }
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all transform hover:scale-105">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PRICE GENERATED BY MD PARVEZ HOSSAIN */}
                    <div className="mt-6 border-t pt-6 px-5">
                        <div className="flex justify-end gap-5  text-lg font-bold">
                            <span>Subtotal:</span>
                            <span id="subtotal">
                                Tk{" "}
                                {cartItems.reduce(
                                    (acc, item) =>
                                        acc + item.price * item.quantity,
                                    0
                                )}
                            </span>
                        </div>
                        <div className="flex justify-end gap-5 text-lg font-bold">
                            <span>Delivery:</span>
                            <span id="delivery">Tk 50</span>
                        </div>
                        <div className="flex justify-end gap-5 text-xl font-bold mt-2">
                            <span>Total:</span>
                            <span id="total">
                                Tk{" "}
                                {cartItems.reduce(
                                    (acc, item) =>
                                        acc + item.price * item.quantity,
                                    0
                                ) + 50}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold text-center">
                            Payment Options
                        </h2>
                        <div className="flex justify-center gap-10 mt-4 space-x-4">
                            <label className="payment-option flex items-center space-x-2 transition-all transform hover:scale-105">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Cash"
                                    onChange={() => selectPayment("Cash")}
                                    className="mr-2"
                                />
                                <i className="fas fa-money-bill-wave text-green-500 text-2xl"></i>
                                <span className="text-xl">Cash</span>
                            </label>
                            <label className="payment-option flex items-center space-x-2 transition-all transform hover:scale-105">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Card"
                                    onChange={() => selectPayment("Card")}
                                    className="mr-2"
                                />
                                <i className="fas fa-credit-card text-blue-500 text-2xl"></i>
                                <span className="text-xl">Card</span>
                            </label>
                            <label className="payment-option flex items-center space-x-2 transition-all transform hover:scale-105">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Due Payment"
                                    onChange={() =>
                                        selectPayment("Due Payment")
                                    }
                                    className="mr-2"
                                />
                                <i className="fas fa-clock text-yellow-500 text-2xl"></i>
                                <span className="text-xl">Due Payment</span>
                            </label>
                        </div>
                        <div
                            className="text-center mt-4 text-lg"
                            id="selected-payment">
                            Selected Payment Method: {selectedPayment}
                        </div>
                    </div>
                    <button
                        className="submit mt-6 mx-auto block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-bold text-lg uppercase disabled:opacity-50 hover:bg-gradient-to-l hover:from-yellow-500 hover:to-orange-500"
                        id="submit-button"
                        onClick={submitOrder}
                        disabled={selectedPayment === "None"}>
                        Submit Order
                    </button>
                </div>
            </div>
            <CustomerPayment
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                customerID={customerID}
                cartItems={cartItems}
                selectedPayment={selectedPayment}
            />
        </div>
    );
};

export default CustomerCart;
