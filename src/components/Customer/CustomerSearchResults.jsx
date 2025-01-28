import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CustomerSideBar from "./CustomerSideBar";
import ProductCard from "./ProductCard"; // Import the ProductCard component

const CustomerSearchResults = () => {
    const location = useLocation();
    const [allResults, setAllResults] = useState([]); // Immutable list of all results
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("asc");
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [category, setCategory] = useState("All Categories");
    const [categories, setCategories] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get("query");

        if (query) {
            setLoading(true);
            axios
                .get("http://localhost:8081/cusnav-search", {
                    params: { query },
                })
                .then((response) => {
                    setAllResults(response.data);
                    setSearchResults(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching search results:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        // Fetch categories
        axios
            .get("http://localhost:8081/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setCategoriesLoading(false);
            });
    }, [location.search]);

    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);
        applyFilters(order, priceRange, category);
    };

    const handlePriceRangeChange = (e) => {
        const [min, max] = e.target.value.split("-").map(Number);
        const range = [min, max];
        setPriceRange(range);
        applyFilters(sortOrder, range, category);
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        applyFilters(sortOrder, priceRange, selectedCategory);
    };

    const applyFilters = (order, range, selectedCategory) => {
        let filteredResults = [...allResults];

        // Filter by category
        if (selectedCategory !== "All Categories") {
            filteredResults = filteredResults.filter(
                (result) => result.category_id === parseInt(selectedCategory)
            );
        }

        // Filter by price range
        filteredResults = filteredResults.filter(
            (result) => result.price >= range[0] && result.price <= range[1]
        );

        // Sort results
        filteredResults.sort((a, b) => {
            return order === "asc" ? a.price - b.price : b.price - a.price;
        });

        setSearchResults(filteredResults);
    };

    if (loading) {
        return <div>Loading search results...</div>;
    }

    if (categoriesLoading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div className="flex">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                customerID={1} // Replace with dynamic customerID if available
                name="John Doe" // Replace with dynamic name if available
            />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Search Results</h1>
                <div className="mb-4 flex space-x-4">
                    <select
                        value={sortOrder}
                        onChange={handleSortChange}
                        className="p-2 border rounded">
                        <option value="asc">Sort by Price: Low to High</option>
                        <option value="desc">Sort by Price: High to Low</option>
                    </select>
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="p-2 border rounded">
                        <option value="All Categories">All Categories</option>
                        {categories.map((cat) => (
                            <option
                                key={cat.category_id}
                                value={cat.category_id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={`${priceRange[0]}-${priceRange[1]}`}
                        onChange={handlePriceRangeChange}
                        className="p-2 border rounded">
                        <option value="0-10000">All Prices</option>
                        <option value="0-100">0 - 100 Taka</option>
                        <option value="100-500">100 - 500 Taka</option>
                        <option value="500-1000">500 - 1000 Taka</option>
                        <option value="1000-5000">1000 - 5000 Taka</option>
                        <option value="5000-10000">5000 - 10000 Taka</option>
                    </select>
                </div>
                {searchResults.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((result) => (
                            <ProductCard
                                key={result.product_id}
                                product={result}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSearchResults;
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import CustomerSideBar from "./CustomerSideBar";

// const CustomerSearchResults = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [allResults, setAllResults] = useState([]); // Immutable list of all results
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [categoriesLoading, setCategoriesLoading] = useState(true);
//     const [sortOrder, setSortOrder] = useState("asc");
//     const [priceRange, setPriceRange] = useState([0, 10000]);
//     const [category, setCategory] = useState("All Categories");
//     const [categories, setCategories] = useState([]);
//     const [isCollapsed, setIsCollapsed] = useState(false);

//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const query = queryParams.get("query");

//         if (query) {
//             setLoading(true);
//             axios
//                 .get("http://localhost:8081/cusnav-search", {
//                     params: { query },
//                 })
//                 .then((response) => {
//                     setAllResults(response.data);
//                     setSearchResults(response.data);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching search results:", error);
//                 })
//                 .finally(() => {
//                     setLoading(false);
//                 });
//         }

//         // Fetch categories
//         axios
//             .get("http://localhost:8081/categories")
//             .then((response) => {
//                 setCategories(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error fetching categories:", error);
//             })
//             .finally(() => {
//                 setCategoriesLoading(false);
//             });
//     }, [location.search]);

//     const handleProductClick = (shopId) => {
//         navigate(`/customer-to-shop/${shopId}`);
//     };

//     const handleSortChange = (e) => {
//         const order = e.target.value;
//         setSortOrder(order);
//         applyFilters(order, priceRange, category);
//     };

//     const handlePriceRangeChange = (e) => {
//         const [min, max] = e.target.value.split("-").map(Number);
//         const range = [min, max];
//         setPriceRange(range);
//         applyFilters(sortOrder, range, category);
//     };

//     const handleCategoryChange = (e) => {
//         const selectedCategory = e.target.value;
//         setCategory(selectedCategory);
//         applyFilters(sortOrder, priceRange, selectedCategory);
//     };

//     const applyFilters = (order, range, selectedCategory) => {
//         let filteredResults = [...allResults];

//         // Filter by category
//         if (selectedCategory !== "All Categories") {
//             filteredResults = filteredResults.filter(
//                 (result) => result.category_id === parseInt(selectedCategory)
//             );
//         }

//         // Filter by price range
//         filteredResults = filteredResults.filter(
//             (result) => result.price >= range[0] && result.price <= range[1]
//         );

//         // Sort results
//         filteredResults.sort((a, b) => {
//             return order === "asc" ? a.price - b.price : b.price - a.price;
//         });

//         setSearchResults(filteredResults);
//     };

//     if (loading) {
//         return <div>Loading search results...</div>;
//     }

//     if (categoriesLoading) {
//         return <div>Loading categories...</div>;
//     }

//     return (
//         <div className="flex">
//             <CustomerSideBar
//                 isCollapsed={isCollapsed}
//                 toggleCollapse={toggleCollapse}
//                 customerID={1} // Replace with dynamic customerID if available
//                 name="John Doe" // Replace with dynamic name if available
//             />
//             <div className="flex-1 p-8">
//                 <h1 className="text-2xl font-bold mb-4">Search Results</h1>
//                 <div className="mb-4 flex space-x-4">
//                     <select
//                         value={sortOrder}
//                         onChange={handleSortChange}
//                         className="p-2 border rounded">
//                         <option value="asc">Sort by Price: Low to High</option>
//                         <option value="desc">Sort by Price: High to Low</option>
//                     </select>
//                     <select
//                         value={category}
//                         onChange={handleCategoryChange}
//                         className="p-2 border rounded">
//                         <option value="All Categories">All Categories</option>
//                         {categories.map((cat) => (
//                             <option
//                                 key={cat.category_id}
//                                 value={cat.category_id}>
//                                 {cat.category_name}
//                             </option>
//                         ))}
//                     </select>
//                     <select
//                         value={`${priceRange[0]}-${priceRange[1]}`}
//                         onChange={handlePriceRangeChange}
//                         className="p-2 border rounded">
//                         <option value="0-10000">All Prices</option>
//                         <option value="0-100">0 - 100 Taka</option>
//                         <option value="100-500">100 - 500 Taka</option>
//                         <option value="500-1000">500 - 1000 Taka</option>
//                         <option value="1000-5000">1000 - 5000 Taka</option>
//                         <option value="5000-10000">5000 - 10000 Taka</option>
//                     </select>
//                 </div>
//                 {searchResults.length === 0 ? (
//                     <p>No results found.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {searchResults.map((result) => (
//                             <div
//                                 key={result.product_id}
//                                 className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//                                 onClick={() =>
//                                     handleProductClick(result.shop_id)
//                                 }>
//                                 <img
//                                     src={result.image_url}
//                                     alt={result.title}
//                                     className="w-full h-72 object-cover rounded-t-lg"
//                                 />
//                                 <div className="p-4">
//                                     <h2 className="text-xl font-semibold">
//                                         {result.title}
//                                     </h2>
//                                     <p className="text-gray-600">
//                                         {result.description}
//                                     </p>
//                                     <p className="text-gray-800 font-bold">
//                                         {result.price} Taka
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CustomerSearchResults;
