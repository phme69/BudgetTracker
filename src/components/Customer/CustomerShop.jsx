import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomerSideBar from './CustomerSideBar';
import { FaChevronDown } from 'react-icons/fa';

const CustomerShop = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex min-h-screen">
            <CustomerSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />
            <div className="flex-1 p-6">
                <CShopHome />
            </div>
        </div>
    );
};

export default CustomerShop;

const CShopHome = () => {
    const [areaDropdownVisible, setAreaDropdownVisible] = useState(false);
    const [selectedArea, setSelectedArea] = useState("All Locations");
    const [shops, setShops] = useState([]);
    const areas = ["Gulshan 1", "Sayednagar", "Dhanmondi"];
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleAreaDropdown = () => {
        setAreaDropdownVisible(!areaDropdownVisible);
    };

    const selectArea = (area) => {
        setSelectedArea(area);
        setAreaDropdownVisible(false);
        if (area === "All Locations") {
            fetchAllShops();
        } else {
            fetchShopsByArea(area);
        }
    };

    const fetchAllShops = () => {
        axios.get('http://localhost:8081/shops')
            .then(response => {
                setShops(response.data);
            })
            .catch(error => {
                console.error('Error fetching shops:', error);
            });
    };

    const fetchShopsByArea = (areaName) => {
        axios.get(`http://localhost:8081/shops/area-name/${areaName}`)
            .then(response => {
                setShops(response.data);
            })
            .catch(error => {
                console.error('Error fetching shops:', error);
            });
    };

    useEffect(() => {
        // Fetch all shops by default
        fetchAllShops();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAreaDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleShopClick = (shopId) => {
        navigate(`/customer-to-shop/${shopId}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Shops</h1>
                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <div>
                        <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            onClick={toggleAreaDropdown}
                        >
                            {selectedArea}
                            <FaChevronDown className="ml-2 h-5 w-5" />
                        </button>
                        {areaDropdownVisible && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                <li 
                                    onClick={() => selectArea("All Locations")}
                                    className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300">
                                    All Locations
                                </li>
                                {areas.map((area) => (
                                    <li key={area} 
                                        onClick={() => selectArea(area)}
                                        className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300">
                                        {area}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-lg">
                {shops.length === 0 ? (
                    <p>No shops available for the selected area.</p>
                ) : (
                    shops.map(shop => (
                        <div key={shop.shop_id} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer" onClick={() => handleShopClick(shop.shop_id)}>
                            <img src={shop.shop_image} alt={shop.shop_name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-bold">{shop.shop_name}</h3>
                                <p className="text-gray-700">{shop.full_address}</p>
                                <p className="text-gray-700">Rating: {shop.shop_rating}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import CustomerSideBar from './CustomerSideBar';
// import { FaChevronDown } from 'react-icons/fa'; // dropdown icon

// const CustomerShop = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     return (
//         <div className="flex min-h-screen">
//             <CustomerSideBar
//                 isCollapsed={isCollapsed}
//                 toggleCollapse={toggleCollapse}
//             />
//             <div className="flex-1 p-6">
//                 <CShopHome />
//             </div>
//         </div>
//     );
// };

// export default CustomerShop;

// const CShopHome = () => {
//     const [areaDropdownVisible, setAreaDropdownVisible] = useState(false);
//     const [selectedArea, setSelectedArea] = useState("All Locations");
//     const [shops, setShops] = useState([]);
//     const areas = ["Gulshan 1", "Sayednagar", "Dhanmondi"];
//     const dropdownRef = useRef(null);

//     const toggleAreaDropdown = () => {
//         setAreaDropdownVisible(!areaDropdownVisible);
//     };

//     const selectArea = (area) => {
//         setSelectedArea(area);
//         setAreaDropdownVisible(false);
//         if (area === "All Locations") {
//             fetchAllShops();
//         } else {
//             fetchShopsByArea(area);
//         }
//     };

//     const fetchAllShops = () => {
//         axios.get('http://localhost:8081/shops')
//             .then(response => {
//                 setShops(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching shops:', error);
//             });
//     };

//     const fetchShopsByArea = (areaName) => {
//         axios.get(`http://localhost:8081/shops/area-name/${areaName}`)
//             .then(response => {
//                 setShops(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching shops:', error);
//             });
//     };

//     useEffect(() => {
//         // Fetch all shops by default
//         fetchAllShops();
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setAreaDropdownVisible(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [dropdownRef]);

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">Shops</h1>
//                 <div className="relative inline-block text-left" ref={dropdownRef}>
//                     <div>
//                         <button
//                             type="button"
//                             className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
//                             onClick={toggleAreaDropdown}
//                         >
//                             {selectedArea}
//                             <FaChevronDown className="ml-2 h-5 w-5" />
//                         </button>
//                         {areaDropdownVisible && (
//                             <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
//                                 <li 
//                                     onClick={() => selectArea("All Locations")}
//                                     className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300">
//                                     All Locations
//                                 </li>
//                                 {areas.map((area) => (
//                                     <li key={area} 
//                                         onClick={() => selectArea(area)}
//                                         className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300">
//                                         {area}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-lg">
//                 {shops.length === 0 ? (
//                     <p>No shops available for the selected area.</p>
//                 ) : (
//                     shops.map(shop => (
//                         <div key={shop.shop_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
//                             <img src={shop.shop_image} alt={shop.shop_name} className="w-full h-48 object-cover" />
//                             <div className="p-4">
//                                 <h3 className="text-lg font-bold">{shop.shop_name}</h3>
//                                 <p className="text-gray-700">{shop.full_address}</p>
//                                 <p className="text-gray-700">Rating: {shop.shop_rating}</p>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// // import React, { useState } from 'react';
// // import CustomerSideBar from './CustomerSideBar';

// // const CustomerShop = () => {
// //     const [isCollapsed, setIsCollapsed] = useState(false);
// //     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

// //     return (
// //         <div className="flex min-h-screen">
// //             <CustomerSideBar
// //                 isCollapsed={isCollapsed}
// //                 toggleCollapse={toggleCollapse}
// //             />
// //             <div className="flex-1 p-6">
// //                 <CShopHome />
// //             </div>
// //         </div>
// //     );
// // };

// // export default CustomerShop;

// // const CShopHome = () => {
// //     const [areaDropdownVisible, setAreaDropdownVisible] = useState(false);
// //     const [selectedArea, setSelectedArea] = useState("Select Your Location");

// //     const toggleAreaDropdown = () => {
// //         setAreaDropdownVisible(!areaDropdownVisible);
// //     };

// //     const selectArea = (area) => {
// //         setSelectedArea(area);
// //         setAreaDropdownVisible(false);
// //     };

// //     const areas = ["SayeedNagar", "Basundhara", "Gulshan-1"];

// //     return (
// //         <div className="min-h-screen mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
// //             <div className="flex items-center justify-between mb-6">
// //                 <h1 className="text-4xl font-extrabold text-gray-800">Shop</h1>
// //                 <div className="relative">
// //                     <button
// //                         onClick={toggleAreaDropdown}
// //                         className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
// //                     >
// //                         {selectedArea}
// //                     </button>
// //                     {areaDropdownVisible && (
// //                         <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
// //                             {areas.map((area) => (
// //                                 <li key={area} 
// //                                     onClick={() => selectArea(area)}
// //                                     className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300">
// //                                     {area}
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     )}
// //                 </div>
// //             </div>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-lg">
// //     {['Hanged Up', 'UniMart', 'Amazon'].map((shop, index) => (
// //         <a key={index} href={`https://www.${shop.toLowerCase().replace(/\s/g, '')}.com`} 
// //             className="flex flex-col items-center justify-center w-80 h-52 bg-gradient-to-r from-orange-200 via-indigo-300 to-green-200 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
// //             <span className="text-xl font-semibold text-gray-800">{shop}</span>
// //         </a>
// //     ))}
// // </div>

// //         </div>
// //     );
// // };
