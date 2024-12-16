import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoMdCall, IoMdVideocam, IoMdSearch } from "react-icons/io";
import Picker from 'emoji-picker-react';

import { IoSend } from "react-icons/io5";
import { RiAttachment2, RiCloseLine, RiDownload2Line, RiEmotionHappyLine, RiFullscreenExitLine, RiFullscreenLine, RiMicLine, RiMore2Fill } from "react-icons/ri";
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
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);


  const toggleEmojiPicker = () => {
    setIsEmojiModalOpen((prev) => !prev); // Toggles between open and close
  };



  const handleEmojiSelect = (emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage((prevMessage) => (prevMessage || "") + emojiObject.emoji);
    } else {
      console.warn("Invalid emoji object or emoji not found:", emojiObject);
    }
    setIsEmojiModalOpen(false);
  };

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


  //media options
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
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


  //delete messaage use effect
  useEffect(() => {
    // Listen for message deletion from the server
    socket.current.on('messageDeleted', ({ messageId, deletedBy }) => {
      // Remove the deleted message from the UI
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));

      // Optionally, you can show a message in the UI indicating who deleted the message
      console.log(`${deletedBy} deleted a message`);
    });

    return () => {
      socket.current.off('messageDeleted');
    };
  }, []);


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

  const sendMessage = async () => {
    if (isSending.current || !isConnected.current) return;

    // Check if there's a message (text or media)
    if (newMessage.trim() || selectedMedia.length > 0) {
      isSending.current = true;

      let mediaFiles = [];

      // If there are media files, upload them to the server
      if (selectedMedia.length > 0) {
        mediaFiles = await Promise.all(
          selectedMedia.map(async (file) => {
            // Create FormData to send the file to the server
            const formData = new FormData();
            formData.append("file", file);

            try {
              // Make a POST request to the API to upload the file
              const response = await fetch("/api/New/chatMediaUpload", {
                method: "POST",
                body: formData,
              });

              // Check if the response is ok
              if (!response.ok) {
                throw new Error("Failed to upload media");
              }

              const data = await response.json();
              const fileURL = data.url;

              return {
                url: fileURL,
                type: file.type.startsWith("image")
                  ? "image"
                  : file.type.startsWith("video")
                    ? "video"
                    : "file",
                name: file.name,
              };
            } catch (error) {
              console.error("Error uploading media:", error);
              return null;
            }
          })
        );

        // Filter out any failed uploads (null values)
        mediaFiles = mediaFiles.filter((media) => media !== null);
      }

      // Create the message object, include media if available
      const messageObject = {
        chatRoomId: chatRoomId,
        text: newMessage.trim() || " ",  // Default to a space if no text is entered
        sender: authenticatedUser?.fullName || "You",
        senderId: currentUserId || authenticatedUser?.id,
        senderName: authenticatedUser?.fullName || "You",
        media: mediaFiles, // Attach media files if any
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fullTimestamp: new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
        senderImage: authenticatedUser?.image,
      };

      // Emit the message to the server
      socket.current.emit("sendMessage", messageObject);

      // Reset input fields and media state
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
  const handleMessageClick = (index) => {
    setSelectedMessageIndex(index);  // Set the index of the clicked message
    setShowMessageDialog(true);      // Show the message details modal
  };
  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();  // Use the file name from the URL or provide a custom name
    a.click();
  };


  const confirmDeleteMessage = () => {
    setShowDeleteConfirmation(true);
  };

  //delete the text message handle
  const deleteMessage = async () => {
    if (selectedMessageIndex !== null) {
      const message = messages[selectedMessageIndex];
      const messageId = message._id;

      // Optimistically update the local UI (remove the message instantly)
      const updatedMessages = messages.filter((msg, index) => index !== selectedMessageIndex);
      setMessages(updatedMessages);

      // Emit a delete message request to the server with the user who is deleting the message
      socket.current.emit('deleteMessage', {
        chatRoomId,
        messageId,
        deletedBy: authenticatedUser?.fullName || "Unknown User"  // Pass the user who deleted the message
      });

      // Close the message dialog after deletion
      closeMessageDialog();
    }
  };

  const openFileInContainer = (fileUrl) => {
    // If it's a document file, you can open it in a new container or iframe
    window.open(fileUrl, '_blank');
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

    // Get the previous assignees from the ref or initialize to an empty array
    const previousAssignees = previousAssigneeRef.current || [];

    // Only proceed if the modal is being opened (no user interactions, just modal visibility)
    if (previousAssignees.length === 0) {
      // This is the initial opening without any actual changes in assignees
      previousAssigneeRef.current = assignedUsers;
      return;
    }

    // Only send messages if there are actual changes
    if (assignedUsers.length !== previousAssignees.length || !assignedUsers.every((user, index) => user === previousAssignees[index])) {
      // Track the added and removed assignees
      const addedAssignees = assignedUsers.filter(user => !previousAssignees.includes(user));
      const removedAssignees = previousAssignees.filter(user => !assignedUsers.includes(user));

      // Handle unassigning users
      if (removedAssignees.length > 0) {
        removedAssignees.forEach(user => {
          const unassignMessage = {
            text: `${user} unassigned`,
            senderId: null,
            senderName: "System",
            senderImage: null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            isSystemMessage: true,
            media: [],
            chatRoomId
          };

          // Emit the unassign message to the server for each user removed
          socket.current.emit("sendMessage", unassignMessage);
        });
      }

      // Handle assigning users
      if (addedAssignees.length > 0) {
        addedAssignees.forEach(user => {
          const assignMessage = {
            text: `${user} assigned`,
            senderId: null,
            senderName: "System",
            senderImage: null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fullTimestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            isSystemMessage: true,
            media: [],
            chatRoomId
          };

          // Emit the assign message to the server for each user added
          socket.current.emit("sendMessage", assignMessage);
        });
      }

      // Update the previousAssigneeRef with the current list for the next effect run
      previousAssigneeRef.current = assignedUsers;
    }
  }, [assignedUsers, chatRoomId, socket]); // Dependencies are assignedUsers, chatRoomId, socket

  return (
    <div className="w-full h-[600px] rounded-lg border border-gray-300 shadow-md flex flex-col">
      <header className="h-12 w-full border-b bg-gray-300 flex justify-between items-center p-3 gap-4 relative">
        <h1 className="text-sm font-bold">Discussion Panel - Assigned By :{chatRoomName}</h1>
        <div className="flex items-center gap-4">
          <IoMdSearch
            size={25}
            className="cursor-pointer text-black hover:text-blue-600 mr-5"
            onClick={toggleSearchDropdown}
          />
          {/* <IoMdCall size={20} className="cursor-pointer text-gray-600 hover:text-gray-800" />
          <IoMdVideocam size={20} className="cursor-pointer text-gray-600 hover:text-gray-800" /> */}

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

                      onClick={() => handleMessageClick(index)} // Open message details on click
                    >
                      <p className="font-semibold">{msg.senderName}</p>
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
                    {msg.senderId === (currentUserId || authenticatedUser?.id) ? "You" : msg.senderName}
                  </strong>
                )}

                {msg.text && (
                  <p className={`${msg.isSystemMessage ? "inline" : "mt-1"} text-sm break-words whitespace-pre-wrap`}>
                    {msg.text}
                  </p>
                )}

                {!msg.isSystemMessage && <small className="text-gray-400 text-xs mt-1">{msg.time}</small>}

                {msg.media && (
                  <div className="mt-2 space-y-4">
                    {msg.media.map((file, idx) => (
                      <div key={idx} className="cursor-pointer relative">
                        {/* Image Preview */}
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt="Media"
                            className="w-full rounded-lg hover:scale-105 transform transition-all duration-300"
                            onClick={() => openMediaPreview(file, idx)}
                          />
                        ) : file.type === "video" ? (
                          <video
                            controls
                            src={file.url}
                            className="w-full sm:w-[500px] md:w-[700px] lg:w-[900px] rounded-lg hover:scale-105 transform transition-all duration-300"
                            onClick={() => openMediaPreview(file, idx)}
                          />

                        ) : (
                          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-md">
                            <div className="flex items-center space-x-2">
                              <RiDownload2Line className="text-gray-600" />
                              <a
                                download={file.name}
                                className="text-black underline truncate max-w-[180px] sm:max-w-[200px]"
                              >
                                {file.name}
                              </a>
                            </div>
                            {/* Three-Dot Icon for File Options */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openMediaPreview(file, idx);
                              }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <RiMore2Fill size={24} />
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
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 ${isFullscreen ? "h-screen" : "h-auto"}`}
        >
          <div
            className={`bg-white p-6 rounded-lg ${isFullscreen ? "w-full h-full" : "w-96 max-w-full"} relative overflow-hidden`}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeMediaPreview}
            >
              <RiCloseLine size={24} />
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <RiFullscreenExitLine size={24} /> : <RiFullscreenLine size={24} />}
            </button>

            {/* Media Preview */}
            <div className="mb-4 overflow-hidden flex justify-center items-center">
              {previewMedia.type === "image" ? (
                <img
                  src={previewMedia.url}
                  alt="Media Preview"
                  className={`rounded-lg ${isFullscreen ? "object-contain max-h-[500px] max-w-max" : "object-contain max-h-96"}`}
                />
              ) : previewMedia.type === "video" ? (
                <video
                  controls
                  src={previewMedia.url}
                  className={`rounded-lg ${isFullscreen ? "max-w-full max-h-full object-contain" : "w-full max-h-96 object-contain"}`}
                />
              ) : previewMedia.type === "file" ? (
                <div
                  className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg cursor-pointer"
                  onClick={() => openFileInContainer(previewMedia.url)}
                >
                  <RiDownload2Line className="text-gray-600" size={24} />
                  <span className="text-gray-800 font-medium">{previewMedia.name}</span>
                  <span className="text-blue-500">Open File</span>
                </div>
              ) : null}

            </div>

            {/* Info Section (Visible Only in Normal Mode) */}
            {!isFullscreen && (
              <div className="text-gray-600 text-sm mb-4">
                <p>Sent by: You</p>
                <p>Date and Time: {messages[previewMediaIndex]?.fullTimestamp}</p>
              </div>
            )}

            {/* Actions Section (Visible Only in Normal Mode) */}
            {!isFullscreen && (
              <div className="flex justify-between items-center">
                <a
                  onClick={() => handleDownload(previewMedia.url, previewMedia.name)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <RiDownload2Line className="mr-2" /> Download
                </a>
                <button
                  onClick={deleteMessage}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Media
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showMessageDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg w-96 max-w-lg shadow-lg transform transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Message Details</h2>

            {/* Message Text */}
            <div className="bg-blue-100 p-4 rounded-lg shadow-inner mb-6 max-h-60 overflow-y-auto">
              <p className="text-lg text-gray-700 whitespace-pre-wrap break-words">
                {messages[selectedMessageIndex]?.text.trim() || "Media"}
              </p>
            </div>

            {/* Sender Info */}
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={messages[selectedMessageIndex]?.senderImage} // Add default avatar if profile picture is missing
                alt="Sender's avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{messages[selectedMessageIndex]?.senderName}</p>
                <p className="text-sm text-gray-500">{messages[selectedMessageIndex]?.fullTimestamp}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeMessageDialog}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              {/* Delete button visible only if the authenticated user is the sender */}
              {messages[selectedMessageIndex]?.senderId === authenticatedUser?.id && (
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
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

      <footer className="relative w-full flex p-3 items-center gap-2 bg-gray-300 rounded-b-lg">
        {/* Attachment Icon */}
        <label
          className="relative text-2xl cursor-pointer text-gray-500 hover:text-gray-700"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <RiAttachment2 className="text-3xl text-blue-600 hover:text-blue-400" />
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
                className="relative text-red-500 rounded-full hover:text-white hover:bg-red-500 transition-all duration-300 p-1 group"
              >
                <RiCloseLine
                  size={20}
                  className="group-hover:rotate-90 transform transition-transform duration-300"
                />
                <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Cancel
                </span>
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
          rows="1"
          style={{
            minHeight: '2rem',
            maxHeight: '4rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
          onKeyDown={handleKeyDown}
        />
        {/* Emoji Picker Icon */}
        {/* Emoji Picker Icon */}
        <button
          className="text-3xl text-blue-500 hover:text-blue-600"
          onClick={toggleEmojiPicker} // Toggle Emoji Picker
        >
          <RiEmotionHappyLine />
        </button>


        {/* Emoji Picker Modal */}
        {isEmojiModalOpen && (
          <div className="absolute bottom-12 left-32 bg-white shadow-md rounded-lg p-2 w-fit">
            <button
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEmojiModalOpen(false)} // Close Modal
            >
              <RiCloseLine />
            </button>
            <Picker
              onEmojiClick={(selectedEmoji, event) => {
                handleEmojiSelect(selectedEmoji);
              }}
              style={{
                height: '350px',
                width: '300px',
              }}
            />
          </div>
        )}


        {/* Send Button */}
        <IoSend
          className="text-4xl cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={sendMessage}
        />
      </footer>

    </div>
  );
};

export default ChatApp;

