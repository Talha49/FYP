import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoMdCall, IoMdVideocam, IoMdSearch } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { RiAttachment2, RiCloseLine, RiDownload2Line } from "react-icons/ri";

// Set up a ref for the socket connection
const ChatApp = ({ chatRoomName, assignedUsers, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [previewMediaIndex, setPreviewMediaIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [previousAssignee, setPreviousAssignee] = useState(null);

  const socket = useRef(null); // Socket instance as a ref to avoid re-initialization on re-renders
  const isConnected = useRef(false); // Flag to check if socket is connected
  const isSending = useRef(false); // Flag to prevent duplicate sends
  const scrollRef = useRef(null); // Ref for auto-scrolling to the latest message

  useEffect(() => {
    // Initialize the socket connection only once
    if (!socket.current) {
      socket.current = io("http://localhost:3001"); // Replace with your server's address if different
    }

    // Set the connected flag when socket connects or disconnects
    socket.current.on("connect", () => {
      isConnected.current = true;
    });
    socket.current.on("disconnect", () => {
      isConnected.current = false;
    });

    // Retrieve stored messages from localStorage
    const storedMessages = localStorage.getItem(`chat_${chatRoomName}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    // Listen for messages from the server
    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.current.on("receiveMessage", handleReceiveMessage);

    // Clean up the socket listener on component unmount
    return () => {
      socket.current.off("receiveMessage", handleReceiveMessage);
    };
  }, [chatRoomName]);

  useEffect(() => {
    // Scroll to the latest message whenever messages update
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedMedia(files);
    setShowMediaPreview(true);
    e.target.value = null; // Clear the input to avoid re-opening
  };
  const sendMessage = () => {
    if (isSending.current || !isConnected.current) return; // Prevent duplicate sends if already sending or disconnected
  
    if (newMessage.trim() || selectedMedia.length > 0) {
      isSending.current = true; // Set sending flag to prevent duplicates
  
      const mediaFiles = selectedMedia.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "file",
        name: file.name,
      }));
  
      const messageObject = {
        text: newMessage,
        sender: "You",
        senderId: currentUserId,
        media: mediaFiles,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      };
  
      // Emit the message to the server
      socket.current.emit("sendMessage", messageObject);
  
      // Update local state and localStorage with the new message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, messageObject];
        localStorage.setItem(`chat_${chatRoomName}`, JSON.stringify(updatedMessages)); // Save to localStorage
        return updatedMessages;
      });
  
      // Reset input fields and flags
      setNewMessage("");
      setSelectedMedia([]);
      setShowMediaPreview(false);
  
      isSending.current = false; // Reset sending flag after send
    }
  };
  

  const cancelSelectedMedia = () => {
    setSelectedMedia([]);
    setShowMediaPreview(false);
  };

  const openMediaPreview = (file, messageIndex) => {
    setPreviewMedia(file);
    setPreviewMediaIndex(messageIndex);
    setShowMediaPreview(true);
  };

  const closeMediaPreview = () => {
    setPreviewMedia(null);
    setPreviewMediaIndex(null);
    setShowMediaPreview(false);
  };

  const deleteMediaFromMessage = () => {
    const updatedMessages = [...messages];
    const message = updatedMessages[previewMediaIndex];
    message.media = message.media.filter((file) => file.url !== previewMedia.url);

    // If the message has no text and no media left, delete the entire message
    if (!message.text && message.media.length === 0) {
      updatedMessages.splice(previewMediaIndex, 1);
    }

    setMessages(updatedMessages);
    localStorage.setItem(`chat_${chatRoomName}`, JSON.stringify(updatedMessages));
    closeMediaPreview();
  };

  const toggleSearchDropdown = () => {
    setShowSearchDropdown((prev) => !prev);
    setSearchQuery("");
  };

  const filteredMessages = messages.filter((msg) =>
    msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openMessageDialog = (index) => {
    setSelectedMessageIndex(index);
    setShowMessageDialog(true);
  };

  const closeMessageDialog = () => {
    setShowMessageDialog(false);
    setSelectedMessageIndex(null);
  };

  const deleteMessage = () => {
    const updatedMessages = messages.filter((_, index) => index !== selectedMessageIndex);
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${chatRoomName}`, JSON.stringify(updatedMessages));
    closeMessageDialog();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    // Load the last assigned user from localStorage
    const storedAssignee = localStorage.getItem(`lastAssignee_${chatRoomName}`);
    const currentAssignee = assignedUsers.length > 0 ? assignedUsers[assignedUsers.length - 1] : null;
  
    // Check if there's a change in assignee
    if (storedAssignee && storedAssignee !== currentAssignee) {
      // Send an unassign message if the previous assignee is different
      const unassignMessage = {
        text: `User ${storedAssignee} has been unassigned from this task.`,
        sender: "System",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        isSystemMessage: true,
      };
  
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, unassignMessage];
        localStorage.setItem(`chat_${chatRoomName}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
  
      // Emit the unassign message to the server
      socket.current.emit("sendMessage", unassignMessage);
    }
  
    if (currentAssignee && storedAssignee !== currentAssignee) {
      // Send an assign message if there's a new assignee
      const assignMessage = {
        text: `User ${currentAssignee} has been assigned to this task.`,
        sender: "System",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        isSystemMessage: true,
      };
  
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, assignMessage];
        localStorage.setItem(`chat_${chatRoomName}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
  
      // Emit the assign message to the server
      socket.current.emit("sendMessage", assignMessage);
    }
  
    // Update `localStorage` with the current assignee
    localStorage.setItem(`lastAssignee_${chatRoomName}`, currentAssignee);
  }, [assignedUsers, chatRoomName]);
  
  
  return (
    <div className="w-full h-[600px] rounded-lg border border-gray-300 shadow-md flex flex-col">
      {/* Top Bar */}
      <header className="h-12 w-full border-b bg-gray-300 flex justify-between items-center p-3 gap-4 relative">
        <h1 className="text-lg font-semibold">Discussion Panel - Admin: {chatRoomName}</h1>
        <div className="flex items-center gap-4">
          <IoMdSearch
            size={20}
            className="cursor-pointer"
            onClick={toggleSearchDropdown}
          />
          <IoMdCall size={20} className="cursor-pointer" />
          <IoMdVideocam size={20} className="cursor-pointer" />
        
          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-12 right-4 w-64 bg-white border border-gray-300 shadow-lg rounded-lg p-2 z-10">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-40 overflow-y-auto">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => setShowSearchDropdown(false)}
                    >
                      <p className="font-semibold">{msg.sender}</p>
                      <p className="text-gray-600 text-sm">{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm text-center">No results found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`w-fit max-w-[70%] p-3 rounded-lg ${
              msg.isSystemMessage 
                ? "bg-green-200 text-black mx-auto items-center gap-6  text-[9px] h-16 w-5"  // Styling for system messages
                : msg.senderId === currentUserId
                  ? "bg-blue-500 text-white ml-auto" // Styling for user's own messages
                  : "bg-gray-100 text-black mr-auto" // Styling for other users' messages
            } relative`}
            onDoubleClick={() => openMessageDialog(index)}
          >
            <strong>{msg.sender}</strong>
            {msg.text && <p className="mt-1">{msg.text}</p>}
            <small className="text-gray-400 text-xs mt-1">{msg.time}</small>
            {msg.media && (
              <div className="mt-2 space-y-2">
                {msg.media.map((file, idx) => (
                  <div key={idx} className="cursor-pointer">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt="Media"
                        className="w-full rounded-lg"
                        onClick={() => openMediaPreview(file, index)}
                      />
                    ) : file.type === "video" ? (
                      <video
                        controls
                        src={file.url}
                        className="w-full rounded-lg"
                        onClick={() => openMediaPreview(file, index)}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-lg">
                        <RiDownload2Line />
                        <a
                          href={file.url}
                          download={file.name}
                          className="text-blue-500 underline"
                        >
                          {file.name}
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openMediaPreview(file, index);
                          }}
                          className="text-red-500 ml-2"
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} /> {/* Ref to track the latest message */}
      </div>

      {/* Selected Media Preview with Delete Option */}
      {showMediaPreview && previewMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-20">
          <div className="bg-white p-4 rounded-lg w-96 relative">
            <RiCloseLine
              size={24}
              className="absolute top-3 right-3 cursor-pointer text-gray-500"
              onClick={closeMediaPreview}
            />
            <div className="mb-4">
              {previewMedia.type === "image" ? (
                <img src={previewMedia.url} alt="Media Preview" className="w-full rounded-lg" />
              ) : previewMedia.type === "video" ? (
                <video controls src={previewMedia.url} className="w-full rounded-lg" />
              ) : (
                <div className="flex items-center space-x-2 bg-gray-200 p-2 rounded-lg">
                  <RiDownload2Line />
                  <a
                    href={previewMedia.url}
                    download={previewMedia.name}
                    className="text-blue-500 underline"
                  >
                    {previewMedia.name}
                  </a>
                </div>
              )}
            </div>
            <div className="text-gray-500 text-sm mb-4">
              <p>Sent by: You</p>
              <p>Date and Time: {messages[previewMediaIndex]?.fullTimestamp}</p>
            </div>
            <div className="flex justify-between items-center">
              <a
                href={previewMedia.url}
                download
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center"
              >
                <RiDownload2Line className="mr-2" /> Download
              </a>
              <button
                onClick={deleteMediaFromMessage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Dialog with Full Details and Delete Option */}
      {showMessageDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white p-4 rounded-lg w-80 relative">
            <RiCloseLine
              size={24}
              className="absolute top-3 right-3 cursor-pointer text-gray-500"
              onClick={closeMessageDialog}
            />
            <h2 className="text-lg font-semibold mb-2">Message Details</h2>
            <p className="text-gray-700 mb-2">{messages[selectedMessageIndex]?.text}</p>
            <div className="text-gray-500 text-sm">
              <p>Sent by: {messages[selectedMessageIndex]?.sender}</p>
              <p>Date and Time: {messages[selectedMessageIndex]?.fullTimestamp}</p>
            </div>
            <button
              onClick={deleteMessage}
              className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg"
            >
              Delete Message
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full flex p-3 items-center gap-2 bg-gray-200 rounded-b-lg">
        <label
          className="relative text-2xl cursor-pointer text-gray-500"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <RiAttachment2 className=" text-black" />
          {selectedMedia.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedMedia.length}
            </span>
          )}
          <input
            type="file"
            multiple
            onChange={handleMediaSelect}
            className="hidden"
          />
          {/* Cross Icon Only on Hover */}
          {isHovering && selectedMedia.length > 0 && (
            <div className="absolute bottom-full mb-2 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents reopening the file input
                  cancelSelectedMedia();
                }}
                className="text-red-500"
              >
                <RiCloseLine />
              </button>
            </div>
          )}
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg "
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IoSend className="text-2xl cursor-pointer text-blue-500" onClick={sendMessage} />
      </footer>
    </div>
  );
};

export default ChatApp;
