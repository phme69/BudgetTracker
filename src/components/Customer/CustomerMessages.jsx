import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSideBar from "./CustomerSideBar.jsx";

const CustomerMessages = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const customerID = localStorage.getItem("customerID");
            if (!customerID) {
                console.error("Customer ID not found in local storage");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8081/customer-conversations/${customerID}`
                );
                setConversations(response.data);
                setFilteredConversations(response.data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get("http://localhost:8081/shops");
                setShops(response.data);
                setFilteredShops(response.data);
            } catch (error) {
                console.error("Error fetching shops:", error);
            }
        };

        fetchShops();
    }, []);

    useEffect(() => {
        let interval;
        if (selectedConversation) {
            const fetchMessages = async () => {
                const customerID = localStorage.getItem("customerID");
                try {
                    const response = await axios.get(
                        `http://localhost:8081/messages/${selectedConversation.shop_id}/${customerID}`
                    );
                    setMessages(response.data);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };

            fetchMessages();
            interval = setInterval(fetchMessages, 1000);
        }

        return () => clearInterval(interval);
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        const customerID = localStorage.getItem("customerID");
        const messageData = {
            shop_id: selectedConversation.shop_id,
            customer_id: customerID,
            sender: "customer",
            message: newMessage,
        };

        try {
            await axios.post("http://localhost:8081/messages", messageData);
            setMessages([
                ...messages,
                { ...messageData, timestamp: new Date().toISOString() },
            ]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredConversations = conversations.filter(
            (conversation) =>
                conversation.shop_name.toLowerCase().includes(query) ||
                conversation.shop_id.toString().includes(query)
        );
        setFilteredConversations(filteredConversations);

        const filteredShops = shops.filter(
            (shop) =>
                shop.shop_name.toLowerCase().includes(query) ||
                shop.shop_id.toString().includes(query)
        );
        setFilteredShops(filteredShops);
    };

    const handleNewConversation = (shop) => {
        setSelectedConversation(shop);
        setMessages([]);
    };

    return (
        <>
            <div className="flex">
                <CustomerSideBar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
                    <div className="min-h-screen mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Messages
                        </h1>
                        <div className="flex">
                            <div className="w-1/4 border-r border-gray-200">
                                <h2 className="text-xl font-bold mb-4">
                                    Conversations
                                </h2>
                                <input
                                    type="text"
                                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                                    placeholder="Search by shop ID or name..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <ul>
                                    {filteredConversations.map(
                                        (conversation) => (
                                            <li
                                                key={conversation.shop_id}
                                                className={`p-4 cursor-pointer ${
                                                    selectedConversation &&
                                                    selectedConversation.shop_id ===
                                                        conversation.shop_id
                                                        ? "bg-gray-200"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedConversation(
                                                        conversation
                                                    )
                                                }>
                                                {conversation.shop_name}
                                            </li>
                                        )
                                    )}
                                </ul>
                                <h2 className="text-xl font-bold mt-6 mb-4">
                                    New Conversations
                                </h2>
                                <ul>
                                    {filteredShops.map((shop) => (
                                        <li
                                            key={shop.shop_id}
                                            className={`p-4 cursor-pointer ${
                                                selectedConversation &&
                                                selectedConversation.shop_id ===
                                                    shop.shop_id
                                                    ? "bg-gray-200"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleNewConversation(shop)
                                            }>
                                            {shop.shop_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-3/4 flex flex-col">
                                {selectedConversation ? (
                                    <>
                                        {/* Chat header */}
                                        <div className="p-4 border-b border-gray-200">
                                            <h2 className="text-xl font-bold">
                                                {selectedConversation.shop_name}
                                            </h2>
                                        </div>

                                        {/* Chat messages */}
                                        <div
                                            className="flex-1 p-4 overflow-y-auto"
                                            style={{ maxHeight: "400px" }}>
                                            {messages.map((message) => (
                                                <div
                                                    key={message.message_id}
                                                    className={`mb-4 ${
                                                        message.sender ===
                                                        "customer"
                                                            ? "text-right"
                                                            : ""
                                                    }`}>
                                                    <div
                                                        className={`p-3 rounded-lg max-w-xs ${
                                                            message.sender ===
                                                            "customer"
                                                                ? "bg-blue-500 text-white ml-auto"
                                                                : "bg-gray-200"
                                                        }`}>
                                                        <p>{message.message}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            message.timestamp
                                                        ).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Message input */}
                                        <div className="p-4 border-t border-gray-200">
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) =>
                                                    setNewMessage(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <button
                                                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                                                onClick={handleSendMessage}>
                                                Send
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 p-4">
                                        <p className="text-gray-700">
                                            Select a conversation to start
                                            messaging.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerMessages;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CustomerSideBar from "./CustomerSideBar.jsx";

// const CustomerMessages = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//     const [conversations, setConversations] = useState([]);
//     const [selectedConversation, setSelectedConversation] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");

//     useEffect(() => {
//         const fetchConversations = async () => {
//             const customerID = localStorage.getItem("customerID");
//             if (!customerID) {
//                 console.error("Customer ID not found in local storage");
//                 return;
//             }

//             try {
//                 const response = await axios.get(
//                     `http://localhost:8081/customer-conversations/${customerID}`
//                 );
//                 setConversations(response.data);
//             } catch (error) {
//                 console.error("Error fetching conversations:", error);
//             }
//         };

//         fetchConversations();
//     }, []);

//     useEffect(() => {
//         let interval;
//         if (selectedConversation) {
//             const fetchMessages = async () => {
//                 const customerID = localStorage.getItem("customerID");
//                 try {
//                     const response = await axios.get(
//                         `http://localhost:8081/messages/${selectedConversation.shop_id}/${customerID}`
//                     );
//                     setMessages(response.data);
//                 } catch (error) {
//                     console.error("Error fetching messages:", error);
//                 }
//             };

//             fetchMessages();
//             interval = setInterval(fetchMessages, 1000);
//         }

//         return () => clearInterval(interval);
//     }, [selectedConversation]);

//     const handleSendMessage = async () => {
//         const customerID = localStorage.getItem("customerID");
//         const messageData = {
//             shop_id: selectedConversation.shop_id,
//             customer_id: customerID,
//             sender: "customer",
//             message: newMessage,
//         };

//         try {
//             await axios.post("http://localhost:8081/messages", messageData);
//             setMessages([
//                 ...messages,
//                 { ...messageData, timestamp: new Date().toISOString() },
//             ]);
//             setNewMessage("");
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <>
//             <div className="flex">
//                 <CustomerSideBar
//                     isCollapsed={isCollapsed}
//                     toggleCollapse={toggleCollapse}
//                 />
//                 <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-8">
//                     <div className="min-h-screen mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
//                         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//                             Messages
//                         </h1>
//                         <div className="flex">
//                             <div className="w-1/4 border-r border-gray-200">
//                                 <h2 className="text-xl font-bold mb-4">
//                                     Conversations
//                                 </h2>
//                                 <ul>
//                                     {conversations.map((conversation) => (
//                                         <li
//                                             key={conversation.shop_id}
//                                             className={`p-4 cursor-pointer ${
//                                                 selectedConversation &&
//                                                 selectedConversation.shop_id ===
//                                                     conversation.shop_id
//                                                     ? "bg-gray-200"
//                                                     : ""
//                                             }`}
//                                             onClick={() =>
//                                                 setSelectedConversation(
//                                                     conversation
//                                                 )
//                                             }>
//                                             {conversation.shop_name}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div className="w-3/4 flex flex-col">
//                                 {selectedConversation ? (
//                                     <>
//                                         {/* Chat header */}
//                                         <div className="p-4 border-b border-gray-200">
//                                             <h2 className="text-xl font-bold">
//                                                 {selectedConversation.shop_name}
//                                             </h2>
//                                         </div>

//                                         {/* Chat messages */}
//                                         <div
//                                             className="flex-1 p-4 overflow-y-auto"
//                                             style={{ maxHeight: "400px" }}>
//                                             {messages.map((message) => (
//                                                 <div
//                                                     key={message.message_id}
//                                                     className={`mb-4 ${
//                                                         message.sender ===
//                                                         "customer"
//                                                             ? "text-right"
//                                                             : ""
//                                                     }`}>
//                                                     <div
//                                                         className={`p-3 rounded-lg max-w-xs ${
//                                                             message.sender ===
//                                                             "customer"
//                                                                 ? "bg-blue-500 text-white ml-auto"
//                                                                 : "bg-gray-200"
//                                                         }`}>
//                                                         <p>{message.message}</p>
//                                                     </div>
//                                                     <span className="text-xs text-gray-500">
//                                                         {new Date(
//                                                             message.timestamp
//                                                         ).toLocaleTimeString()}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Message input */}
//                                         <div className="p-4 border-t border-gray-200">
//                                             <input
//                                                 type="text"
//                                                 className="w-full p-2 border border-gray-300 rounded-lg"
//                                                 placeholder="Type a message..."
//                                                 value={newMessage}
//                                                 onChange={(e) =>
//                                                     setNewMessage(
//                                                         e.target.value
//                                                     )
//                                                 }
//                                             />
//                                             <button
//                                                 className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
//                                                 onClick={handleSendMessage}>
//                                                 Send
//                                             </button>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <div className="flex-1 p-4">
//                                         <p className="text-gray-700">
//                                             Select a conversation to start
//                                             messaging.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default CustomerMessages;
