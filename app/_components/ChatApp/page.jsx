import React, { useState, useEffect } from "react";
import { IoMdCall, IoMdVideocam } from "react-icons/io";
import { IoSend } from "react-icons/io5";

const ChatApp = ({ chatRoomName, assignedUsers }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Logic to connect to the chat server (e.g., using WebSocket or Socket.io)
    console.log(`Joined chat room: ${chatRoomName}`);

    // For demo purposes, we'll assume messages come from a mock server
    const mockMessages = [
      { text: "Welcome to the room", sender: "Server" },
      { text: "Hy", sender: "User 1" },
      { text: "Hello!", sender: "User 2" },
    ];
    setMessages(mockMessages);
  }, [chatRoomName]);

  const sendMessage = () => {
    const messageObject = { text: newMessage, sender: "You" };
    setMessages((prev) => [...prev, messageObject]);
    setNewMessage("");
  };

  return (
    <div className="w-full h-[500px] rounded-lg border border-gray-300 shadow-md">
      {/* Top Bar */}
      <header className="h-10 w-full border-b bg-gray-100 flex justify-between items-center p-2 gap-4">
        <h1>Discussion Panel (Admin: {chatRoomName})</h1>
        <div className="flex items-center gap-4">
          <IoMdCall />
          <IoMdVideocam />
        </div>
      </header>

      {/* Chats box */}
      <div className="w-full h-[410px] overflow-y-auto p-2 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-[300px] rounded-lg p-2 ${
              msg.sender === "You"
                ? "bg-blue-500 text-white ml-auto mr-0"
                : "bg-gray-100 text-black ml-0 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="w-full flex p-2 items-center gap-2 bg-gray-100 rounded-b-lg">
        <input
          className="w-full px-4 py-1 border border-gray-300 rounded"
          placeholder="Type your Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IoSend className="text-2xl cursor-pointer" onClick={sendMessage} />
      </footer>
    </div>
  );
};

export default ChatApp;
