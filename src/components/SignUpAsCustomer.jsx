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
    const [customer, setCustomer] = useState({
        customer_level: 1,
        customer_name: "",
        email: "",
        username: "",
        phone_number: phoneNumber,
        address: "",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({
            ...customer,
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
        onNext({ ...customer, image });
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
                        value={customer.phone_number}
                        readOnly
                        className="w-full mt-2 p-2 border rounded bg-gray-200 cursor-not-allowed"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="customer_name"
                        value={customer.customer_name}
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
                        value={customer.email}
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
                        value={customer.username}
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
                        value={customer.address}
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

const ProfileSecure = ({ customerData, onComplete }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append("customer_name", customerData.customer_name);
        formData.append("email", customerData.email);
        formData.append("username", customerData.username);
        formData.append("password", password);
        formData.append("phone_number", customerData.phone_number);
        formData.append("address", customerData.address);
        formData.append("image", customerData.image);

        try {
            await axios.post(
                "http://localhost:8081/customer/register",
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

const SignUpAsCustomer = () => {
    const [step, setStep] = useState(1);
    const [customerData, setCustomerData] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const handleNextFromOTP = (data) => {
        setCustomerData(data);
        setStep(2);
    };

    const handleNextFromProfileInfo = (data) => {
        setCustomerData(data);
        setStep(3);
    };

    const handleComplete = () => {
        setModalVisible(true);
    };

    const handleSignIn = () => {
        navigate("/signin-customer");
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
                            phoneNumber={customerData.phoneNumber}
                        />
                    )}
                    {step === 3 && (
                        <ProfileSecure
                            customerData={customerData}
                            onComplete={handleComplete}
                        />
                    )}
                </div>
            </main>

            {modalVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Registration Successful
                        </h2>
                        <div className="text-center">
                            <button
                                onClick={handleSignIn}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUpAsCustomer;