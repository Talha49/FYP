"use client";
import React from "react";
import { FaTimes, FaBell } from "react-icons/fa";

const NotificationsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, text: "📢 New announcement available!", time: "2025-03-14T14:30:00Z" },
    { id: 2, text: "✅ Profile updated successfully.", time: "2025-03-14T10:15:00Z" },
    { id: 3, text: "⚡ New feature released, check it out!", time: "2025-03-13T18:45:00Z" },
    { id: 4, text: "🎉 Welcome! Your account is now active.", time: "2025-03-12T09:00:00Z" },
  ];

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed top-0 right-0 h-dvh w-[380px] bg-white shadow-lg border-l border-gray-200 flex flex-col transition-transform transform translate-x-0">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b shadow-sm bg-blue-500 text-white">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaBell className="text-xl" /> Notifications
        </h2>
        <button className="text-white hover:text-gray-200" onClick={onClose}>
          <FaTimes size={18} />
        </button>
      </div>

      {/* Notification List */}
      <div className="p-4 flex-1 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 p-3 hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-800">{notif.text}</p>
              <span className="text-xs text-gray-500">{formatDateTime(notif.time)}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No new notifications</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-100">
       
      </div>
    </div>
  );
};

export default NotificationsModal;
