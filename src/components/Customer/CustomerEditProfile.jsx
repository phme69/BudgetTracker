import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerSideBar from "./CustomerSideBar";
import { useDropzone } from "react-dropzone";

const CustomerEditProfile = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [customer, setCustomer] = useState({
        customer_id: "",
        customer_level: "",
        customer_name: "",
        email: "",
        username: "",
        phone_number: "",
        address: "",
        customer_image: "",
    });

    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal for profile update
    const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Modal for image upload success

    useEffect(() => {
        const storedCustomerID = localStorage.getItem("customerID");
        if (storedCustomerID) {
            axios
                .get(`http://localhost:8081/customer/${storedCustomerID}`)
                .then((response) => {
                    setCustomer(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching customer information:",
                        error
                    );
                    setError("Failed to load customer information.");
                });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) {
            setError("No file selected.");
            return;
        }

        const validExtensions = ["image/jpeg", "image/png", "image/gif"];
        if (!validExtensions.includes(file.type)) {
            setError("Invalid file type. Please select a JPEG, PNG, or GIF.");
            return;
        }

        const formData = new FormData();
        formData.append("customer_id", customer.customer_id);
        formData.append("customer_image", file);

        axios
            .post("http://localhost:8081/cprofile-upload", formData)
            .then((response) => {
                const { imagePath } = response.data;
                if (imagePath) {
                    setCustomer((prevCustomer) => ({
                        ...prevCustomer,
                        customer_image: imagePath,
                    }));
                    setIsImageModalOpen(true); // Open image upload success modal
                } else {
                    setError("Error: No image path returned from the server.");
                }
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                setError("Failed to upload image. Please try again.");
            });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!customer.customer_name || !customer.email || !customer.username) {
            setError("Name, Email, and Username are required.");
            return;
        }

        axios
            .put(
                `http://localhost:8081/customer/${customer.customer_id}`,
                customer
            )
            .then(() => {
                setIsModalOpen(true); // Open the modal
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                setError("Failed to update profile. Please try again.");
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.location.reload(); // Refresh the page
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        window.location.reload(); // Refresh the page
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-1">
                <CustomerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 p-6 bg-gray-100">
                    <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                                Edit Profile
                            </h2>
                            {error && (
                                <div className="text-red-500 mb-4">{error}</div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Section for Form Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={customer.customer_name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                className="w-full mt-2 p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={customer.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                className="w-full mt-2 p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={customer.username}
                                                onChange={handleChange}
                                                placeholder="Enter your username"
                                                className="w-full mt-2 p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={customer.phone_number}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                                className="w-full mt-2 p-2 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={customer.address}
                                                onChange={handleChange}
                                                placeholder="Enter your address"
                                                className="w-full mt-2 p-2 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">
                                                Customer Level
                                            </label>
                                            <input
                                                type="number"
                                                name="customer_level"
                                                value={customer.customer_level}
                                                onChange={handleChange}
                                                placeholder="Enter your customer level"
                                                className="w-full mt-2 p-2 border rounded"
                                            />
                                        </div>
                                    </div>
                                    {/* Right Section for Image Upload */}
                                    <div
                                        {...getRootProps()}
                                        className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer">
                                        <input {...getInputProps()} />
                                        {customer.customer_image ? (
                                            <img
                                                src={customer.customer_image}
                                                alt="Profile"
                                                className="w-full h-auto rounded"
                                            />
                                        ) : (
                                            <p className="text-gray-700">
                                                Drag & drop an image here, or
                                                click to select one
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Success
                        </h2>
                        <p>Your profile has been updated successfully!</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Image Upload Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Image Updated
                        </h2>
                        <p>Your profile image has been updated successfully!</p>
                        <button
                            onClick={closeImageModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerEditProfile;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import CustomerSideBar from "./CustomerSideBar";
// import { useDropzone } from "react-dropzone";

// const CustomerEditProfile = () => {
//     const navigate = useNavigate();
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     const [customer, setCustomer] = useState({
//         customer_id: "",
//         customer_level: "",
//         customer_name: "",
//         email: "",
//         username: "",
//         phone_number: "",
//         address: "",
//         customer_image: "",
//     });

//     const [error, setError] = useState("");
//     const [successMessage, setSuccessMessage] = useState("");

//     useEffect(() => {
//         const storedCustomerID = localStorage.getItem("customerID");
//         if (storedCustomerID) {
//             axios
//                 .get(`http://localhost:8081/customer/${storedCustomerID}`)
//                 .then((response) => {
//                     setCustomer(response.data);
//                 })
//                 .catch((error) => {
//                     console.error(
//                         "Error fetching customer information:",
//                         error
//                     );
//                     setError("Failed to load customer information.");
//                 });
//         }
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCustomer((prevCustomer) => ({
//             ...prevCustomer,
//             [name]: value,
//         }));
//     };

//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         if (!file) {
//             setError("No file selected.");
//             return;
//         }

//         const validExtensions = ["image/jpeg", "image/png", "image/gif"];
//         if (!validExtensions.includes(file.type)) {
//             setError("Invalid file type. Please select a JPEG, PNG, or GIF.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("customer_id", customer.customer_id);
//         formData.append("customer_image", file);

//         axios
//             .post("http://localhost:8081/cprofile-upload", formData)
//             .then((response) => {
//                 const { imagePath } = response.data;
//                 if (imagePath) {
//                     setCustomer((prevCustomer) => ({
//                         ...prevCustomer,
//                         customer_image: imagePath,
//                     }));
//                     setSuccessMessage("Profile image uploaded successfully.");
//                 } else {
//                     setError("Error: No image path returned from the server.");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error uploading image:", error);
//                 setError("Failed to upload image. Please try again.");
//             });
//     };

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop,
//         accept: {
//             "image/jpeg": [".jpg", ".jpeg"],
//             "image/png": [".png"],
//             "image/gif": [".gif"],
//         },
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccessMessage("");

//         if (!customer.customer_name || !customer.email || !customer.username) {
//             setError("Name, Email, and Username are required.");
//             return;
//         }

//         axios
//             .put(
//                 `http://localhost:8081/customer/${customer.customer_id}`,
//                 customer
//             )
//             .then((response) => {
//                 setSuccessMessage("Profile updated successfully.");
//                 navigate("/customer-profile");
//             })
//             .catch((error) => {
//                 console.error("Error updating profile:", error);
//                 setError("Failed to update profile. Please try again.");
//             });
//     };

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex flex-1">
//                 <CustomerSideBar
//                     isCollapsed={isCollapsed}
//                     toggleCollapse={toggleCollapse}
//                 />
//                 <div className="flex-1 p-6 bg-gray-100">
//                     <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//                         <div className="p-6">
//                             <h2 className="text-3xl font-semibold text-gray-800 mb-6">
//                                 Edit Profile
//                             </h2>
//                             {error && (
//                                 <div className="text-red-500 mb-4">{error}</div>
//                             )}
//                             {successMessage && (
//                                 <div className="text-green-500 mb-4">
//                                     {successMessage}
//                                 </div>
//                             )}
//                             <form onSubmit={handleSubmit}>
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                                     {/* Left Section for Form Inputs */}
//                                     <div className="space-y-4">
//                                         <div>
//                                             <label className="block text-gray-700">
//                                                 Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="customer_name"
//                                                 value={customer.customer_name}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your name"
//                                                 className="w-full mt-2 p-2 border rounded"
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-gray-700">
//                                                 Email
//                                             </label>
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={customer.email}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your email"
//                                                 className="w-full mt-2 p-2 border rounded"
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-gray-700">
//                                                 Username
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="username"
//                                                 value={customer.username}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your username"
//                                                 className="w-full mt-2 p-2 border rounded"
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-gray-700">
//                                                 Phone Number
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="phone_number"
//                                                 value={customer.phone_number}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your phone number"
//                                                 className="w-full mt-2 p-2 border rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-gray-700">
//                                                 Address
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="address"
//                                                 value={customer.address}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your address"
//                                                 className="w-full mt-2 p-2 border rounded"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-gray-700">
//                                                 Customer Level
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 name="customer_level"
//                                                 value={customer.customer_level}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your customer level"
//                                                 className="w-full mt-2 p-2 border rounded"
//                                             />
//                                         </div>
//                                     </div>
//                                     {/* Right Section for Image Upload */}
//                                     <div
//                                         {...getRootProps()}
//                                         className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer">
//                                         <input {...getInputProps()} />
//                                         {customer.customer_image ? (
//                                             <img
//                                                 src={customer.customer_image}
//                                                 alt="Profile"
//                                                 className="w-full h-auto rounded"
//                                             />
//                                         ) : (
//                                             <p className="text-gray-700">
//                                                 Drag & drop an image here, or
//                                                 click to select one
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="mt-6">
//                                     <button
//                                         type="submit"
//                                         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CustomerEditProfile;
