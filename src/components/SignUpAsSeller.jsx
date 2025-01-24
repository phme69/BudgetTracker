import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import signup_img from "../assets/SignUpPage/signup_img.png";

const OTPPage = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");

    const handleSendCode = () => {
        if (!phoneNumber) {
            alert("Please enter a phone number.");
            return;
        }
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        setGeneratedOtp(randomNumber.toString());
        console.log(`Generated OTP: ${randomNumber}`);
        setIsOtpSent(true);
    };

    const handleVerifyOtp = () => {
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }
        if (otp === generatedOtp) {
            onNext({ phoneNumber });
        } else {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="bg-slate-100 p-8 rounded-lg shadow-lg animate-slideInRight">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Verify Phone Number
            </h2>
            <div className="mb-6">
                <label
                    htmlFor="phone-number"
                    className="block mb-2 text-sm text-gray-600">
                    Enter your phone number
                </label>
                <div className="flex">
                    <select className="border border-gray-300 rounded-l px-4 py-2">
                        <option value="+880">+880</option>
                    </select>
                    <input
                        type="text"
                        id="phone-number"
                        placeholder="13220XXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border border-gray-300 rounded-r px-4 py-2 flex-grow focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                </div>
            </div>
            {isOtpSent && (
                <div className="mb-6">
                    <label
                        htmlFor="otp"
                        className="block mb-2 text-sm text-gray-600">
                        Enter OTP
                    </label>
                    <input
                        type="text"
                        id="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                </div>
            )}
            {!isOtpSent ? (
                <button
                    onClick={handleSendCode}
                    className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
                    Send Code
                </button>
            ) : (
                <button
                    onClick={handleVerifyOtp}
                    className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
                    Verify OTP
                </button>
            )}
        </div>
    );
};

const ProfileInfo = ({ onNext, phoneNumber }) => {
    const [seller, setSeller] = useState({
        seller_name: "",
        email: "",
        username: "",
        phone_number: phoneNumber,
        address: "",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSeller({
            ...seller,
            [name]: value,
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImage(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please select a profile picture before proceeding.");
            return;
        }
        onNext({ ...seller, image });
    };

    return (
        <div className="bg-slate-100 p-8 rounded-lg shadow-lg animate-slideInRight">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Profile Information
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        value={seller.phone_number}
                        readOnly
                        className="w-full mt-2 p-2 border rounded bg-gray-200 cursor-not-allowed"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="seller_name"
                        value={seller.seller_name}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={seller.email}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={seller.username}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={seller.address}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded"
                    />
                </div>

                <div
                    className="h-36 mb-3 border-dashed border-2 border-gray-400 p-4 rounded-lg"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}>
                    <p className="text-center text-gray-500">
                        Drag and drop your profile picture here
                    </p>
                    {image && (
                        <div className="mt-4 text-center">
                            <p>{image.name}</p>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
                    Next
                </button>
            </form>
        </div>
    );
};

const ProfileSecure = ({ sellerData, onComplete }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append("seller_name", sellerData.seller_name);
        formData.append("email", sellerData.email);
        formData.append("username", sellerData.username);
        formData.append("password", password);
        formData.append("phone_number", sellerData.phone_number);
        formData.append("address", sellerData.address);
        formData.append("image", sellerData.image);

        try {
            await axios.post(
                "http://localhost:8081/seller/register",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            onComplete();
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className="bg-slate-100 p-8 rounded-lg shadow-lg animate-slideInRight">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Secure Your Profile
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-2 p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mt-2 p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
                    Complete Registration
                </button>
            </form>
        </div>
    );
};

const SignUpAsSeller = () => {
    const [step, setStep] = useState(1);
    const [sellerData, setSellerData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();

    const handleNextFromOTP = (data) => {
        setSellerData(data);
        setStep(2);
    };

    const handleNextFromProfileInfo = (data) => {
        setSellerData(data);
        setStep(3);
    };

    const handleComplete = () => {
        setRegistrationSuccess(true);
        setModalVisible(true);
    };

    const handleSignIn = () => {
        navigate("/signin-seller");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-white flex items-center">
            <main className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">
                <div className="md:flex object-cover justify-end">
                    <img
                        src={signup_img}
                        alt="SignUp"
                        className="p-10 object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center p-8 space-y-8 animate-fadeIn">
                    {step === 1 && <OTPPage onNext={handleNextFromOTP} />}
                    {step === 2 && (
                        <ProfileInfo
                            onNext={handleNextFromProfileInfo}
                            phoneNumber={sellerData.phoneNumber}
                        />
                    )}
                    {step === 3 && (
                        <ProfileSecure
                            sellerData={sellerData}
                            onComplete={handleComplete}
                        />
                    )}
                </div>
            </main>

            {modalVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            {registrationSuccess
                                ? "Registration Successful"
                                : "Registration Failed"}
                        </h2>
                        <div className="text-center">
                            {registrationSuccess ? (
                                <button
                                    onClick={handleSignIn}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
                                    Sign In
                                </button>
                            ) : (
                                <button
                                    onClick={handleGoHome}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
                                    Go Home
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUpAsSeller;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import signup_img from "../assets/SignUpPage/signup_img.png";

// const OTPPage = ({ onNext }) => {
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [otp, setOtp] = useState("");
//     const [isOtpSent, setIsOtpSent] = useState(false);
//     const [generatedOtp, setGeneratedOtp] = useState(""); // Store the generated OTP

//     const handleSendCode = () => {
//         if (!phoneNumber) {
//             alert("Please enter a phone number.");
//             return;
//         }
//         const randomNumber = Math.floor(1000 + Math.random() * 9000);
//         setGeneratedOtp(randomNumber.toString()); // Store OTP as a string for easy comparison
//         console.log(`Generated OTP: ${randomNumber}`);
//         console.log(`Sending OTP to ${phoneNumber}`);
//         setIsOtpSent(true);
//     };

//     const handleVerifyOtp = () => {
//         if (!otp) {
//             alert("Please enter the OTP.");
//             return;
//         }
//         console.log(`Verifying OTP: ${otp}`);
//         if (otp === generatedOtp) {
//             onNext(phoneNumber); // Proceed to the next step if OTP matches
//         } else {
//             alert("Invalid OTP");
//         }
//     };

//     return (
//         <div className="bg-slate-100 p-8 rounded-lg shadow-lg animate-slideInRight">
//             <h2 className="text-2xl font-bold mb-4 text-center">
//                 Verify Phone Number
//             </h2>
//             <div className="mb-6">
//                 <label
//                     htmlFor="phone-number"
//                     className="block mb-2 text-sm text-gray-600">
//                     Enter your phone number
//                 </label>
//                 <div className="flex">
//                     <select className="border border-gray-300 rounded-l px-4 py-2">
//                         <option value="+880">+880</option>
//                     </select>
//                     <input
//                         type="text"
//                         id="phone-number"
//                         placeholder="13220XXXXX"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         className="border border-gray-300 rounded-r px-4 py-2 flex-grow focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                     />
//                 </div>
//             </div>
//             {isOtpSent && (
//                 <div className="mb-6">
//                     <label
//                         htmlFor="otp"
//                         className="block mb-2 text-sm text-gray-600">
//                         Enter OTP
//                     </label>
//                     <input
//                         type="text"
//                         id="otp"
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                     />
//                 </div>
//             )}
//             {!isOtpSent ? (
//                 <button
//                     onClick={handleSendCode}
//                     className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
//                     Send Code
//                 </button>
//             ) : (
//                 <button
//                     onClick={handleVerifyOtp}
//                     className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
//                     Verify OTP
//                 </button>
//             )}
//         </div>
//     );
// };

// const ProfileInfo = ({ phoneNumber, onNext }) => {
//     const [seller, setSeller] = useState({
//         username: "",
//         seller_name: "",
//         email: "",
//         phone_number: phoneNumber, // Set the phone number from the prop
//         address: "",
//         seller_image: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSeller({
//             ...seller,
//             [name]: value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onNext(seller);
//     };

//     return (
//         <div className="bg-slate-100 p-8 rounded-lg shadow-lg max-w max-h animate-slideInRight">
//             <h2 className="text-2xl font-bold mb-4 text-center">
//                 Profile Information
//             </h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Phone Number</label>
//                     <input
//                         type="text"
//                         name="phone_number"
//                         value={seller.phone_number}
//                         className="w-full mt-2 p-2 border rounded bg-gray-200"
//                         readOnly
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Username</label>
//                     <input
//                         type="text"
//                         name="username"
//                         value={seller.username}
//                         onChange={handleChange}
//                         className="w-full mt-2 p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Full Name</label>
//                     <input
//                         type="text"
//                         name="seller_name"
//                         value={seller.seller_name}
//                         onChange={handleChange}
//                         className="w-full mt-2 p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Email</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={seller.email}
//                         onChange={handleChange}
//                         className="w-full mt-2 p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Address</label>
//                     <input
//                         type="text"
//                         name="address"
//                         value={seller.address}
//                         onChange={handleChange}
//                         className="w-full mt-2 p-2 border rounded"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">
//                         Profile Image URL
//                     </label>
//                     <input
//                         type="text"
//                         name="seller_image"
//                         value={seller.seller_image}
//                         onChange={handleChange}
//                         className="w-full mt-2 p-2 border rounded"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
//                     Next
//                 </button>
//             </form>
//         </div>
//     );
// };

// const ProfileSecure = ({ sellerData, onComplete }) => {
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [modalVisible, setModalVisible] = useState(false);
//     const [registrationSuccess, setRegistrationSuccess] = useState(false);

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };

//     const handleConfirmPasswordChange = (e) => {
//         setConfirmPassword(e.target.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (password !== confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }

//         const seller = { ...sellerData, password };
//         axios
//             .post("http://localhost:8081/seller/register", seller)
//             .then((response) => {
//                 console.log("Seller registered successfully:", response.data);
//                 setRegistrationSuccess(true);
//                 setModalVisible(true);
//                 onComplete();
//             })
//             .catch((error) => {
//                 console.error("Error registering seller:", error);
//                 setRegistrationSuccess(false);
//                 setModalVisible(true);
//             });
//     };

//     const handleCloseModal = () => {
//         setModalVisible(false);
//     };

//     const navigate = useNavigate();
//     const handleGoHome = () => {
//         navigate("/");
//     };

//     const handleSignIn = () => {
//         navigate("/signin-seller");
//     };

//     return (
//         <div className="bg-slate-100 p-8 rounded-lg shadow-lg max-w max-h animate-slideInRight">
//             <h2 className="text-2xl font-bold mb-4 text-center">
//                 Secure Your Profile
//             </h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Password</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={handlePasswordChange}
//                         className="w-full mt-2 p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700">
//                         Confirm Password
//                     </label>
//                     <input
//                         type="password"
//                         value={confirmPassword}
//                         onChange={handleConfirmPasswordChange}
//                         className="w-full mt-2 p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 transition duration-300 ease-in-out transform hover:scale-105">
//                     Complete Registration
//                 </button>
//             </form>

//             {modalVisible && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg">
//                         <h2 className="text-2xl font-bold mb-4 text-center">
//                             {registrationSuccess
//                                 ? "Registration Successful"
//                                 : "Registration Failed"}
//                         </h2>
//                         <div className="text-center">
//                             {registrationSuccess ? (
//                                 <button
//                                     onClick={handleSignIn}
//                                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
//                                     Sign In
//                                 </button>
//                             ) : (
//                                 <button
//                                     onClick={handleGoHome}
//                                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
//                                     Go Home
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const SignUpAsSeller = () => {
//     const [step, setStep] = useState(1);
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [sellerData, setSellerData] = useState({});

//     const handleNextFromOTP = (phone) => {
//         setPhoneNumber(phone);
//         setStep(2);
//     };

//     const handleNextFromProfileInfo = (data) => {
//         setSellerData({ ...data, phone_number: phoneNumber });
//         setStep(3);
//     };

//     const handleComplete = () => {
//         console.log("Registration complete");
//         // Redirect or show success message
//     };

//     return (
//         <div className="min-h-screen bg-white flex items-center">
//             <main className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">
//                 {/* Left Section - Image */}
//                 <div className="md:flex object-cover justify-end">
//                     <img
//                         src={signup_img}
//                         alt="Image from Sign Up"
//                         className="p-10 object-cover"
//                     />
//                 </div>

//                 {/* Right Section - Form */}
//                 <div className="flex flex-col justify-center p-8 space-y-8 animate-fadeIn">
//                     {step === 1 && <OTPPage onNext={handleNextFromOTP} />}
//                     {step === 2 && (
//                         <ProfileInfo
//                             phoneNumber={phoneNumber}
//                             onNext={handleNextFromProfileInfo}
//                         />
//                     )}
//                     {step === 3 && (
//                         <ProfileSecure
//                             sellerData={sellerData}
//                             onComplete={handleComplete}
//                         />
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default SignUpAsSeller;
