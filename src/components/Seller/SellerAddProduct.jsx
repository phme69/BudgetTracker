import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        price: "",
        stock_quantity: "",
        brand: "",
        max_discountable_price: "",
        description: "",
        image: null
    });
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        // Fetch product categories from database
        axios
            .get("http://localhost:8081/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product categories:", error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                image: e.target.files[0]
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData({
                ...formData,
                image: e.dataTransfer.files[0]
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        axios
            .post("http://localhost:8081/products", data)
            .then((response) => {
                console.log("Product added successfully:", response.data);
                // Reset form
                setFormData({
                    category_id: "",
                    title: "",
                    price: "",
                    stock_quantity: "",
                    brand: "",
                    max_discountable_price: "",
                    description: "",
                    image: null
                });
            })
            .catch((error) => {
                console.error("Error adding product:", error);
            });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 w-full">
            <div className="bg-white shadow-md rounded-lg p-6 w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    ADD PRODUCT
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {/* Left Column */}
                        <div className="col-span-1">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Select Product Category
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.category_id}
                                            value={category.category_id}
                                        >
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Product Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Product Unit/MRP Rate
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Total Unit To Be Stocked
                                </label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Brand/Company Name
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Maximum Discountable Price
                                </label>
                                <input
                                    type="number"
                                    name="max_discountable_price"
                                    value={formData.max_discountable_price}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-span-1 flex flex-col justify-center">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Upload Product Image
                            </label>
                            <div
                                className={`border-dashed border-2 p-6 rounded-lg flex flex-col items-center justify-center h-full ${
                                    dragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <p className="text-gray-500 mb-2">
                                    Drag & drop files or{" "}
                                    <span className="text-blue-500">
                                        Browse
                                    </span>
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Supported formats: JPEG, PNG
                                </p>
                                <input
                                    type="file"
                                    name="image"
                                    className="hidden"
                                    id="fileUpload"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="fileUpload"
                                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                                >
                                    UPLOAD FILES
                                </label>
                                {formData.image && (
                                    <p className="mt-2 text-sm text-green-600">
                                        {formData.image.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Product Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                            placeholder="In detail, describe the product."
                            maxLength="225"
                        ></textarea>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded-lg"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                        >
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SellerAddProduct = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const location = useLocation();
    const locationState = location.state || {};
    const { sellerID: locationSellerId, name: locationName } = locationState;

    useEffect(() => {
        if (locationSellerId && locationName) {
            localStorage.setItem("sellerID", locationSellerId);
            localStorage.setItem("name", locationName);
        }
    }, [locationSellerId, locationName]);

    const sellerID = localStorage.getItem("sellerID") || "Unknown";
    const name = localStorage.getItem("sellerName") || "Seller";

    return (
        <>
            <SellerNavbar />
            <div className="flex">
                <SellerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
                    <AddProduct />
                </div>
            </div>
            <SellerFooter />
        </>
    );
};

export default SellerAddProduct;


// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import SellerNavbar from "./SellerNavbar";
// import SellerFooter from "./SellerFooter";
// import SellerSideBar from "./SellerSideBar";

// const AddProduct = () => {
//     return (
//         <div className="min-h-screen flex justify-center items-center  bg-gray-100 w-full">
//             <div className="bg-white shadow-md rounded-lg p-6 w-full">
//                 <h2 className="text-2xl font-bold mb-4 text-center">
//                     ADD PRODUCT
//                 </h2>

//                 <form>
//                     <div className="grid grid-cols-2 gap-4 w-full">
//                         <div className="col-span-1">
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                                     Select Product Category
//                                 </label>
//                                 <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
//                                     <option>Text</option>
//                                     {/* Add more options here */}
//                                 </select>
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                                     Product Title
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                                     Product Unit/MRP Rate
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                                     Total Unit To Be Stocked
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                                     Brand/Company Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                                     Maximum Discountable Price
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>
//                         </div>

//                         <div className="col-span-1 flex flex-col justify-center ">
//                             <label className="block text-gray-700 text-sm font-bold mb-2">
//                                 Upload Product Image
//                             </label>
//                             <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center h-full">
//                                 <p className="text-gray-500 mb-2">
//                                     Drag & drop files or{" "}
//                                     <span className="text-blue-500">
//                                         Browse
//                                     </span>
//                                 </p>
//                                 <p className="text-gray-500 text-xs">
//                                     Supported formats: JPEG, PNG, GIF, MP4, PDF,
//                                     PSD, AI, Word, PPT
//                                 </p>
//                                 <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg">
//                                     UPLOAD FILES
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Product Description
//                         </label>
//                         <textarea
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             rows="3"
//                             placeholder="In details the description of the product."
//                             maxLength="225"></textarea>
//                     </div>

//                     <div className="flex justify-between">
//                         <button
//                             type="button"
//                             className="bg-red-500 text-white py-2 px-4 rounded-lg">
//                             CANCEL
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-green-500 text-white py-2 px-4 rounded-lg">
//                             SUBMIT
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// const SellerAddProduct = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     const location = useLocation();
//     const locationState = location.state || {};
//     const { sellerID: locationSellerId, name: locationName } = locationState;

//     useEffect(() => {
//         if (locationSellerId && locationName) {
//             localStorage.setItem("sellerID", locationSellerId);
//             localStorage.setItem("name", locationName);
//         }
//     }, [locationSellerId, locationName]);

//     const sellerID = localStorage.getItem("sellerID") || "Unknown";
//     const name = localStorage.getItem("name") || "Seller";

//     console.log("SellerAddProduct received:", { sellerID, name }); // Debugging line

//     return (
//         <>
//             <SellerNavbar />
//             <div className="flex">
//                 <SellerSideBar
//                     isCollapsed={isCollapsed}
//                     toggleCollapse={toggleCollapse}
//                 />
//                 <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
//                     <AddProduct />
//                 </div>
//             </div>
//             <SellerFooter />
//         </>
//     );
// };

// export default SellerAddProduct;
