import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoMdCall, IoMdVideocam, IoMdSearch } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { RiAttachment2, RiCloseLine, RiDownload2Line } from "react-icons/ri";
import { useSession } from "next-auth/react";
const ChatApp = ({ chatRoomId, chatRoomName, assignedUsers, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [previewMediaIndex, setPreviewMediaIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const previousAssigneeRef = useRef(null); // Initialize useRef

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { data: session } = useSession();
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const socket = useRef(null);
  const isConnected = useRef(false);
  const isSending = useRef(false);
  const chatContainerRef = useRef(null);
  const hasMounted = useRef(false); // Track component mount
  const textareaRef = useRef(null);

  // Adjust the height of the textarea based on its content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on the content
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };


  // Effect to adjust height when message changes
  useEffect(() => {
    adjustHeight(); // Adjust height when message changes
  }, [newMessage]);

  useEffect(() => {
    if (session) {
      setAuthenticatedUser(session?.user?.userData);
    }
  }, [session]);
  
  const [hasJoined, setHasJoined] = useState(false);  // Track if the user has already joined the chat room
  
  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:3001');
    }
  
    if (!hasMounted.current) {
      socket.current.on('connect', () => {
        isConnected.current = true;
        console.log('Connected to socket server');
  
        if (authenticatedUser?.id) {
          console.log(`Setting user: ${authenticatedUser.id}`);
          socket.current.emit('setUser', authenticatedUser?.id);
        }
  
        if (!hasJoined) {
          // Join the chat room only once
          socket.current.emit('joinChatRoom', chatRoomId);
          setHasJoined(true);  // Mark as joined to prevent emitting multiple times
        }
      });
  
      socket.current.on('disconnect', () => {
        isConnected.current = false;
        console.log('Disconnected from socket server');
      });
  
      // Listen for new messages and append them
      const handleReceiveMessage = (message) => {
        console.log("Received new message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);  // Append new message
      };
  
      socket.current.on('receiveMessage', handleReceiveMessage);
  
      // Listen for initial load of messages when the user joins the chat room
      socket.current.on('loadMessages', (messages) => {
        console.log("Messages loaded from server:", messages);
        setMessages(messages);  // Load previous messages
      });
  
      return () => {
        socket.current.off('receiveMessage', handleReceiveMessage);
        socket.current.off('loadMessages');
      };
    }
  
    hasMounted.current = true;  // Ensure connection setup happens only once
  
  }, [chatRoomId, authenticatedUser, hasJoined]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;  // Auto-scroll to the bottom when messages change
    }
  }, [messages]);
  
  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedMedia(files);
    setShowMediaPreview(true);
    e.target.value = null;
  };
  
  const sendMessage = () => {
    if (isSending.current || !isConnected.current) return;
  
    if (newMessage.trim() || selectedMedia.length > 0) {
      isSending.current = true;
  
      const mediaFiles = selectedMedia.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : "file",
        name: file.name,
      }));
  
      const messageObject = {
        chatRoomId: chatRoomId,
        text: newMessage,
        sender: authenticatedUser?.fullName || "You",
        senderId: currentUserId || authenticatedUser?.id,
        senderName: authenticatedUser?.fullName || "You",
        media: mediaFiles,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fullTimestamp: new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
        senderImage: authenticatedUser?.image,
      };
  
      // Emit the message to the server
      socket.current.emit("sendMessage", messageObject);
  
      // Do not update local state yet, wait for confirmation from the server
  
      // Reset message input and media state
      setNewMessage("");
      setSelectedMedia([]);
      setShowMediaPreview(false);
  
      isSending.current = false;
  
      // Scroll the chat container to the bottom after sending the message
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
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

    if (!message.text && message.media.length === 0) {
      updatedMessages.splice(previewMediaIndex, 1);
    }

    setMessages(updatedMessages);
    localStorage.setItem(`chat_${chatRoomId}`, JSON.stringify(updatedMessages));
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
    if (!messages[index].isSystemMessage) {
      setSelectedMessageIndex(index);
      setShowMessageDialog(true);
    }
  };

  const closeMessageDialog = () => {
    setShowMessageDialog(false);
    setSelectedMessageIndex(null);
    setShowDeleteConfirmation(false);
  };

  const confirmDeleteMessage = () => {
    setShowDeleteConfirmation(true);
  };

  const deleteMessage = () => {
    const updatedMessages = messages.filter((_, index) => index !== selectedMessageIndex);
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${chatRoomId}`, JSON.stringify(updatedMessages));
    closeMessageDialog();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSending.current) {
        sendMessage();
      }
    }
  };

  useEffect(() => {
    // If assignedUsers is empty, we don't proceed
    if (assignedUsers.length === 0) return;
  
    const currentAssignee = assignedUsers[assignedUsers.length - 1];  // Get the last assigned user
  
    // Initialize the previous assignee if it's null
    if (previousAssigneeRef.current === null) {
      previousAssigneeRef.current = currentAssignee;
      return;  // No message needs to be sent at this stage
    }
  
    // Only proceed if the assignee has actually changed
    if (currentAssignee !== previousAssigneeRef.current) {
      // Check for unassign action (only if previous assignee exists)
      if (previousAssigneeRef.current) {
        const unassignMessage = {
          text: `${previousAssigneeRef.current} unassigned`,
          senderId: null,
          senderName: "System",
          senderImage: null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          isSystemMessage: true,
          media: [],
          chatRoomId
        };
  
        // Emit the unassign message to the server
        socket.current.emit("sendMessage", unassignMessage);
      }
  
      // Check for assign action (only if there's a new assignee)
      if (currentAssignee) {
        const assignMessage = {
          text: `${currentAssignee} assigned`,
          senderId: null,
          senderName: "System",
          senderImage: null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          isSystemMessage: true,
          media: [],
          chatRoomId
        };
  
        // Emit the assign message to the server
        socket.current.emit("sendMessage", assignMessage);
      }
    }
  
    // Update the previousAssigneeRef with the current assignee for the next effect run
    previousAssigneeRef.current = currentAssignee;
  }, [assignedUsers, chatRoomId, socket]);  // Dependencies are assignedUsers and chatRoomId
  

  return (
    <div className="w-full h-[600px] rounded-lg border border-gray-300 shadow-md flex flex-col">
      <header className="h-12 w-full border-b bg-gray-300 flex justify-between items-center p-3 gap-4 relative">
        <h1 className="text-sm font-bold">Discussion Panel - Assigned By :{chatRoomName}</h1>
        <div className="flex items-center gap-4">
          <IoMdSearch
            size={20}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={toggleSearchDropdown}
          />
          <IoMdCall size={20} className="cursor-pointer text-gray-600 hover:text-gray-800" />
          <IoMdVideocam size={20} className="cursor-pointer text-gray-600 hover:text-gray-800" />

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

      <div className="flex-1 overflow-hidden">
        <div ref={chatContainerRef} className="h-full overflow-y-auto p-4 space-y-2 bg-white" style={{ maxHeight: 'calc(100% - 1px)' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 w-fit max-w-[70%] p-3 rounded-lg ${msg.isSystemMessage
                  ? "bg-blue-100 text-blue-600 text-xs py-1 px-2 mx-auto"
                  : msg.senderId === (currentUserId || authenticatedUser?.id)
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                } relative`}
              onDoubleClick={() => openMessageDialog(index)}
            >
              {!msg.isSystemMessage && (
                <img
                  src={msg.senderImage || '/path/to/default-profile.jpg'}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}

              <div className="flex flex-col overflow-hidden">
                {!msg.isSystemMessage && (
                  <strong className="text-sm truncate">
                    {msg.senderId === (currentUserId || authenticatedUser?.id) ? "You" : msg.sender}
                  </strong>
                )}

                {msg.text && (
                  <p className={`${msg.isSystemMessage ? "inline" : "mt-1"} text-sm break-words whitespace-pre-wrap`}>
                    {msg.text}
                  </p>
                )}

                {!msg.isSystemMessage && <small className="text-gray-400 text-xs mt-1">{msg.time}</small>}

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
                          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                            <RiDownload2Line className="text-gray-600" />
                            <a
                              href={file.url}
                              download={file.name}
                              className="text-blue-500 underline truncate max-w-[150px]"
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
            </div>
          ))}
        </div>
      </div>

      {showMediaPreview && previewMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeMediaPreview}
            >
              <RiCloseLine size={24} />
            </button>
            <div className="mb-4">
              {previewMedia.type === "image" ? (
                <img src={previewMedia.url} alt="Media Preview" className="w-full rounded-lg" />
              ) : previewMedia.type === "video" ? (
                <video controls src={previewMedia.url} className="w-full rounded-lg" />
              ) : (
                <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg">
                  <RiDownload2Line className="text-gray-600" size={24} />
                  <span className="text-gray-800 font-medium">{previewMedia.name}</span>
                </div>
              )}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              <p>Sent by: You</p>
              <p>Date and Time: {messages[previewMediaIndex]?.fullTimestamp}</p>
            </div>
            <div className="flex justify-between items-center">
              <a
                href={previewMedia.url}
                download
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <RiDownload2Line className="mr-2" /> Download
              </a>
              <button
                onClick={deleteMediaFromMessage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Media
              </button>
            </div>
          </div>
        </div>
      )}

      {showMessageDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4">Message Details</h2>
            <p className="text-gray-700 mb-4">{messages[selectedMessageIndex]?.text}</p>
            <div className="text-sm text-gray-500 mb-6">
              <p>Sent by: {messages[selectedMessageIndex]?.sender}</p>
              <p>Date and Time: {messages[selectedMessageIndex]?.fullTimestamp}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeMessageDialog}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteMessage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full flex p-3 items-center gap-2 bg-gray-300 rounded-b-lg">
        <label
          className="relative text-2xl cursor-pointer text-gray-500 hover:text-gray-700"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <RiAttachment2 className="text-gray-600" />
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
          {isHovering && selectedMedia.length > 0 && (
            <div className="absolute bottom-full mb-2 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cancelSelectedMedia();
                }}
                className="text-red-500 hover:text-red-700"
              >
                <RiCloseLine />
              </button>
            </div>
          )}
        </label>

        {/* Message Input */}
        <textarea
          ref={textareaRef}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your message"
          value={newMessage}
          onChange={handleInputChange}
          rows="1" // Set the initial height (1 line)
          style={{
            minHeight: '2rem', // Height for 1 line
            maxHeight: '4rem', // Maximum height (2 lines)
            overflowY: 'auto', // Enable scrolling after the second line
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
          }}
          onKeyDown={handleKeyDown} // Handle Enter key to send message without increasing height
        />


        <IoSend
          className="text-2xl cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={sendMessage}
        />
      </footer>
    </div>
  );
};

export default ChatApp;
