import React, { useState } from "react";
import axios from "axios";

const ProductCard = ({ product }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] =
        useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleProductClick = () => {
        setIsDetailsVisible(true);
    };

    const handleAddToCart = async () => {
        const customerID = localStorage.getItem("customerID");
        if (!customerID) {
            console.error("Customer ID not found in local storage");
            setErrorMessage("Customer ID not found in local storage");
            setIsDetailsVisible(false);
            return;
        }

        const cartItem = {
            customer_id: customerID,
            product_id: product.product_id,
            quantity: 1, // Default quantity
        };

        try {
            setIsDetailsVisible(false); // Close product detail modal immediately
            await axios.post("http://localhost:8081/cart", cartItem);
            setIsSuccessMessageVisible(true); // Show success message
        } catch (error) {
            console.error("Error adding product to cart:", error);
            setErrorMessage("Failed to add product to cart.");
            setIsDetailsVisible(false); // Close product detail modal
        }
    };

    const closeSuccessMessage = () => {
        setIsSuccessMessageVisible(false);
        setErrorMessage("");
    };

    return (
        <>
            {isDetailsVisible ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {product.title}
                        </h2>
                        <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600 mb-4">
                            {product.description}
                        </p>
                        <p className="text-gray-800 font-bold mb-4">
                            {product.price} Taka
                        </p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                            onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button
                            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg"
                            onClick={() => setIsDetailsVisible(false)}>
                            Close
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={handleProductClick}>
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">
                            {product.title}
                        </h2>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-gray-800 font-bold">
                            {product.price} Taka
                        </p>
                    </div>
                </div>
            )}

            {isSuccessMessageVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p>Product added successfully!</p>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={closeSuccessMessage}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p>{errorMessage}</p>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={closeSuccessMessage}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
// import React, { useState } from "react";
// import axios from "axios";

// const ProductCard = ({ product }) => {
//     const [isDetailsVisible, setIsDetailsVisible] = useState(false);
//     const [isSuccessMessageVisible, setIsSuccessMessageVisible] =
//         useState(false);
//     const [errorMessage, setErrorMessage] = useState("");

//     const handleProductClick = () => {
//         setIsDetailsVisible(true);
//     };

//     const handleAddToCart = async () => {
//         const customerID = localStorage.getItem("customerID");
//         if (!customerID) {
//             console.error("Customer ID not found in local storage");
//             setErrorMessage("Customer ID not found in local storage");
//             setIsDetailsVisible(false);
//             return;
//         }

//         const cartItem = {
//             customer_id: customerID,
//             product_id: product.product_id,
//             quantity: 1, // Default quantity
//         };

//         try {
//             setIsDetailsVisible(false); // Close product detail modal immediately
//             await axios.post("http://localhost:8081/cart", cartItem);
//             setIsSuccessMessageVisible(true); // Show success message
//         } catch (error) {
//             console.error("Error adding product to cart:", error);
//             setErrorMessage("Failed to add product to cart.");
//             setIsDetailsVisible(false); // Close product detail modal
//         }
//     };

//     const closeSuccessMessage = () => {
//         setIsSuccessMessageVisible(false);
//         setErrorMessage("");
//     };

//     return (
//         <>
//             {isDetailsVisible ? (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//                         <h2 className="text-2xl font-bold mb-4">
//                             {product.title}
//                         </h2>
//                         <img
//                             src={product.image_url}
//                             alt={product.title}
//                             className="w-full h-64 object-cover rounded-lg mb-4"
//                         />
//                         <p className="text-gray-600 mb-4">
//                             {product.description}
//                         </p>
//                         <p className="text-gray-800 font-bold mb-4">
//                             {product.price} Taka
//                         </p>
//                         <button
//                             className="bg-blue-500 text-white py-2 px-4 rounded-lg"
//                             onClick={handleAddToCart}>
//                             Add to Cart
//                         </button>
//                         <button
//                             className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg"
//                             onClick={() => setIsDetailsVisible(false)}>
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <div
//                     className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//                     onClick={handleProductClick}>
//                     <img
//                         src={product.image_url}
//                         alt={product.title}
//                         className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     <div className="p-4">
//                         <h2 className="text-xl font-semibold">
//                             {product.title}
//                         </h2>
//                         <p className="text-gray-600">{product.description}</p>
//                         <p className="text-gray-800 font-bold">
//                             {product.price} Taka
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {isSuccessMessageVisible && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded shadow-lg text-center">
//                         <p>Product added successfully!</p>
//                         <button
//                             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             onClick={closeSuccessMessage}>
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded shadow-lg text-center">
//                         <p>{errorMessage}</p>
//                         <button
//                             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             onClick={closeSuccessMessage}>
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ProductCard;
