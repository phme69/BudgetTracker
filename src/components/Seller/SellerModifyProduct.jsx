import React, { useState, useEffect } from "react";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import SellerSideBar from "./SellerSideBar";

const ModifyProduct = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProductID, setSelectedProductID] = useState("");
    const [customProductID, setCustomProductID] = useState("");
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        price: "",
        brand: "",
        max_discountable_price: "",
        description: "",
        stock: 10,
        image: null,
    });
    const [placeholders, setPlaceholders] = useState({});
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const shopID = localStorage.getItem("shopID");

        // Fetch categories
        axios
            .get("http://localhost:8081/categories")
            .then((response) => setCategories(response.data))
            .catch((error) =>
                console.error("Error fetching categories:", error)
            );

        // Fetch products for the specific shop
        axios
            .get("http://localhost:8081/shop-products-update", {
                params: { shop_id: shopID },
            })
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const fetchProductDetails = (productID) => {
        axios
            .get(`http://localhost:8081/shop-products-by-id/${productID}`)
            .then((response) => {
                const product = response.data;
                setPlaceholders({
                    category_id: product.category_id,
                    title: product.title,
                    price: product.price,
                    brand: product.brand,
                    max_discountable_price: product.max_discountable_price,
                    description: product.description,
                    stock: product.stock,
                });
                setFormData({
                    category_id: product.category_id || "",
                    title: product.title || "",
                    price: product.price || "",
                    brand: product.brand || "",
                    max_discountable_price:
                        product.max_discountable_price || "",
                    description: product.description || "",
                    stock: product.stock || 10,
                    image: null, // Reset image
                });
            })
            .catch((error) =>
                console.error("Error fetching product details:", error)
            );
    };

    const handleDropdownChange = (e) => {
        const productID = e.target.value;
        setSelectedProductID(productID);
        if (productID) fetchProductDetails(productID);
    };

    const handleCustomInput = (e) => {
        const productID = e.target.value;
        setCustomProductID(productID);
    };

    const handleCustomSearch = () => {
        if (customProductID) fetchProductDetails(customProductID);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                image: e.target.files[0],
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const shopID = localStorage.getItem("shopID");

        // Create form data
        const data = new FormData();
        data.append("category_id", formData.category_id);
        data.append("title", formData.title);
        data.append("price", formData.price);
        data.append("brand", formData.brand);
        data.append("max_discountable_price", formData.max_discountable_price);
        data.append("description", formData.description);
        if (formData.image) data.append("image", formData.image);
        data.append("shop_id", shopID);
        data.append("stock", formData.stock);

        try {
            // Submit updated product data
            await axios.put(
                `http://localhost:8081/products/${
                    selectedProductID || customProductID
                }`,
                data
            );
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product.");
        }
    };

    return (
        <div>
            <SellerNavbar />
            <div className="flex">
                <SellerSideBar />
                <div className="flex-1 bg-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-4">Modify Product</h2>

                    {/* Search Section */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">
                            Search Product
                        </label>
                        <div className="flex gap-4">
                            {/* Dropdown */}
                            <select
                                value={selectedProductID}
                                onChange={handleDropdownChange}
                                className="border rounded w-1/2 p-2">
                                <option value="">Select Product by ID</option>
                                {products.map((product) => (
                                    <option
                                        key={product.product_id}
                                        value={product.product_id}>
                                        {product.title} (ID:{" "}
                                        {product.product_id})
                                    </option>
                                ))}
                            </select>

                            {/* Custom Input */}
                            <input
                                type="text"
                                value={customProductID}
                                onChange={handleCustomInput}
                                placeholder="Enter Product ID"
                                className="border rounded w-1/2 p-2"
                            />
                            <button
                                onClick={handleCustomSearch}
                                className="bg-blue-500 text-white px-4 py-2 rounded">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Modify Product Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label className="block mb-2">Category</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    placeholder={placeholders.category_id}>
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.category_id}
                                            value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    placeholder={placeholders.title}
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    placeholder={placeholders.price}
                                />
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    placeholder={placeholders.brand}
                                />
                            </div>

                            {/* Max Discountable Price */}
                            <div>
                                <label className="block mb-2">
                                    Max Discount
                                </label>
                                <input
                                    type="number"
                                    name="max_discountable_price"
                                    value={formData.max_discountable_price}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    placeholder={
                                        placeholders.max_discountable_price
                                    }
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    placeholder={placeholders.stock}
                                />
                            </div>

                            {/* Description */}
                            <div className="col-span-2">
                                <label className="block mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    rows="4"
                                    placeholder={
                                        placeholders.description
                                    }></textarea>
                            </div>

                            {/* Image Upload */}
                            <div className="col-span-2">
                                <label className="block mb-2">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
            <SellerFooter />
        </div>
    );
};

export default ModifyProduct;
