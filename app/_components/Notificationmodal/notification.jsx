"use client";
import { useState, useEffect } from "react";
import {
  FaTimes,
  FaBell,
  FaArrowLeft,
  FaCheckCircle,
  FaCheck,
  FaRegDotCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

const NotificationsModal = ({ isOpen, onClose }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  // State for tracking which notification is being viewed
  const [viewingNotification, setViewingNotification] = useState(null);
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  // Active tab state
  const [activeTab, setActiveTab] = useState("all"); // "all", "alerts", "general"
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Error state
  const [error, setError] = useState(null);
  // Optimistic UI updates for read status
  const [localReadStatus, setLocalReadStatus] = useState(new Set());
  const { data: session, status } = useSession(); // ✅ Get session data

  // ✅ Ensure userId is extracted correctly
  const userId = session?.user?.userData?._id || session?.user?.id;

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    return notif.category === activeTab;
  });

  // Group notifications by category
  const alertNotifications = notifications.filter(
    (notif) => notif.category === "alert"
  );
  const generalNotifications = notifications.filter(
    (notif) => notif.category === "general"
  );

  // Check if a notification is read (either in DB or locally)
  const isNotificationRead = (notification) => {
    return notification.isRead || localReadStatus.has(notification._id);
  };

  // Fetch notifications when modal opens or userId changes
  useEffect(() => {
    console.log(
      "🔍 Checking useEffect conditions: isOpen =",
      isOpen,
      "userId =",
      userId
    );

    if (!userId) {
      console.log("⏳ Waiting for session to load...");
      return;
    }

    if (isOpen) {
      console.log("✅ useEffect is triggered! Fetching notifications...");
      fetchNotifications();
    } else {
      console.log(
        "🚫 useEffect skipped: Either modal is closed or userId is missing"
      );
    }
  }, [isOpen, userId]);

  // Handle animation on open/close
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    if (!userId) {
      console.error("User ID is missing, cannot fetch notifications");
      return;
    }

    console.log("Starting to fetch notifications");
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "Making API request to:",
        `/api/getNotifications?userId=${userId}`
      );
      const response = await fetch(`/api/getNotifications?userId=${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch notifications");
      }

      const data = await response.json();
      console.log(`Successfully fetched ${data.length} notifications`);
      setNotifications(data);

      // Initialize local read status from fetched data
      const readIds = new Set();
      data.forEach((notif) => {
        if (notif.isRead) {
          readIds.add(notif._id);
        }
      });
      setLocalReadStatus(readIds);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close with animation
  const handleClose = () => {
    fetchNotifications();
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setViewingNotification(null);
    }, 300);
  };

  // Format date time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format relative time
  const getRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? "Yesterday" : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return `${diffHour}h ago`;
    } else if (diffMin > 0) {
      return `${diffMin}m ago`;
    } else {
      return "Just now";
    }
  };

  // Mark a notification as read
  const handleMarkAsRead = async (notificationId, event) => {
    if (event) event.stopPropagation();

    // Optimistic update
    setLocalReadStatus((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      return newSet;
    });

    try {
      const response = await fetch("/api/getNotifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      const updatedNotification = await response.json();

      // Update the notifications state to reflect the change
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);

      // Revert optimistic update on error
      setLocalReadStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    // Get all unread notification IDs
    const unreadIds = notifications
      .filter((notif) => !isNotificationRead(notif))
      .map((notif) => notif._id);

    // Optimistic update
    const newReadStatus = new Set(localReadStatus);
    unreadIds.forEach((id) => newReadStatus.add(id));
    setLocalReadStatus(newReadStatus);

    try {
      const response = await fetch("/api/getNotifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mark-all-read",
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Update the notifications state to reflect the change
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);

      // Revert optimistic update on error
      const revertedReadStatus = new Set(localReadStatus);
      unreadIds.forEach((id) => {
        if (!notifications.find((n) => n._id === id)?.isRead) {
          revertedReadStatus.delete(id);
        }
      });
      setLocalReadStatus(revertedReadStatus);
    }
  };

  // Mark all notifications in a category as read
  const handleMarkCategoryAsRead = async (category) => {
    // Get all unread notification IDs in this category
    const unreadIds = notifications
      .filter(
        (notif) => notif.category === category && !isNotificationRead(notif)
      )
      .map((notif) => notif._id);

    // Optimistic update
    const newReadStatus = new Set(localReadStatus);
    unreadIds.forEach((id) => newReadStatus.add(id));
    setLocalReadStatus(newReadStatus);

    try {
      const response = await fetch("/api/getNotifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mark-all-read",
          userId,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark ${category} notifications as read`);
      }

      // Update the notifications state to reflect the change
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.category === category ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error(`Failed to mark ${category} notifications as read:`, err);

      // Revert optimistic update on error
      const revertedReadStatus = new Set(localReadStatus);
      unreadIds.forEach((id) => {
        if (!notifications.find((n) => n._id === id)?.isRead) {
          revertedReadStatus.delete(id);
        }
      });
      setLocalReadStatus(revertedReadStatus);
    }
  };

  // View notification details
  const viewNotification = (notification) => {
    setViewingNotification(notification);

    // Mark as read when viewed if not already read
    if (!isNotificationRead(notification)) {
      handleMarkAsRead(notification._id);
    }
  };

  // Go back to notifications list
  const goBackToList = () => {
    setViewingNotification(null);
  };

  // Get unread count
  const unreadCount = notifications.filter(
    (n) => !isNotificationRead(n)
  ).length;
  const unreadAlertCount = alertNotifications.filter(
    (n) => !isNotificationRead(n)
  ).length;
  const unreadGeneralCount = generalNotifications.filter(
    (n) => !isNotificationRead(n)
  ).length;

  // Render notification item
  const renderNotificationItem = (notif) => (
    <div
      key={notif._id}
      onClick={() => viewNotification(notif)}
      className={`bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer relative overflow-hidden group ${
        isNotificationRead(notif)
          ? "border border-gray-100"
          : notif.category === "alert"
          ? "border-l-4 border-l-red-500 border border-gray-100"
          : "border-l-4 border-l-blue-500 border border-gray-100"
      }`}
    >
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-start gap-2">
            {notif.category === "alert" && (
              <span
                className={`mt-0.5 ${
                  notif.priority === "high"
                    ? "text-red-500"
                    : notif.priority === "medium"
                    ? "text-amber-500"
                    : "text-yellow-500"
                }`}
              >
                <FaExclamationTriangle size={14} />
              </span>
            )}
            <p
              className={`text-sm ${
                isNotificationRead(notif)
                  ? "text-gray-600"
                  : "font-medium text-gray-800"
              }`}
            >
              {notif.title}
            </p>
          </div>
          {!isNotificationRead(notif) && (
            <button
              onClick={(e) => handleMarkAsRead(notif._id, e)}
              className={`ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                notif.category === "alert"
                  ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                  : "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              }`}
              aria-label="Mark as read"
            >
              <FaCheckCircle size={14} />
            </button>
          )}
        </div>
        <p
          className={`text-xs ${
            isNotificationRead(notif) ? "text-gray-500" : "text-gray-600"
          } line-clamp-2`}
        >
          {notif.message}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            {getRelativeTime(notif.createdAt)}
            {isNotificationRead(notif) ? (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                • <FaCheck size={8} /> Read
              </span>
            ) : (
              <span
                className={`text-xs flex items-center gap-0.5 ${
                  notif.category === "alert" ? "text-red-500" : "text-blue-500"
                }`}
              >
                • <FaRegDotCircle size={8} /> New
              </span>
            )}
          </span>
        </div>
      </div>
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
    </div>
  );

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 h-full w-full sm:w-[380px] bg-white shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b bg-white sticky top-0 z-10">
        {viewingNotification ? (
          <button
            onClick={goBackToList}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Back to notifications"
          >
            <FaArrowLeft size={16} />
            <span className="font-medium">Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <FaBell className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {!viewingNotification && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              aria-label="Mark all as read"
            >
              <FaCheck size={10} />
              Mark all read
            </button>
          )}
          <button
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            onClick={handleClose}
            aria-label="Close notifications"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>

      {/* Tabs - Only show when not viewing a notification */}
      {!viewingNotification && (
        <div className="flex border-b bg-white">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "all"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
            {unreadCount > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-600 text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("alert")}
            className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "alert"
                ? "text-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Alerts
            {unreadAlertCount > 0 && (
              <span className="ml-1 bg-red-100 text-red-600 text-xs px-1.5 rounded-full">
                {unreadAlertCount}
              </span>
            )}
            {activeTab === "alert" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "general"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            General
            {unreadGeneralCount > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-600 text-xs px-1.5 rounded-full">
                {unreadGeneralCount}
              </span>
            )}
            {activeTab === "general" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
            )}
          </button>
        </div>
      )}

      {/* Content Area */}
      {viewingNotification ? (
        // Notification Detail View
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div
            className={`bg-white rounded-lg shadow-sm border p-4 mb-3 animate-fadeIn ${
              viewingNotification.category === "alert"
                ? "border-l-4 border-l-red-500"
                : "border-gray-100"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-2">
                {viewingNotification.category === "alert" && (
                  <span
                    className={`mt-1 ${
                      viewingNotification.priority === "high"
                        ? "text-red-500"
                        : viewingNotification.priority === "medium"
                        ? "text-amber-500"
                        : "text-yellow-500"
                    }`}
                  >
                    <FaExclamationTriangle size={16} />
                  </span>
                )}
                <h3 className="font-bold text-lg text-gray-800">
                  {viewingNotification.title}
                </h3>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2 bg-gray-100 px-2 py-1 rounded-full">
                {formatDateTime(viewingNotification.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {viewingNotification.message}
            </p>
            <div className="flex justify-end">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                onClick={goBackToList}
              >
                <FaArrowLeft size={12} /> Back to notifications
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Notifications List View
        <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center h-64">
              <FaSpinner className="animate-spin text-blue-600 text-3xl mb-4" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={fetchNotifications}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredNotifications.length === 0 && (
            <div className="text-center text-gray-500 mt-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {activeTab === "alert" ? (
                  <FaExclamationTriangle className="text-gray-300 text-xl" />
                ) : (
                  <FaBell className="text-gray-300 text-xl" />
                )}
              </div>
              <p className="font-medium text-gray-600">
                No{" "}
                {activeTab === "all"
                  ? ""
                  : activeTab === "alert"
                  ? "alert "
                  : "general "}
                notifications
              </p>
              <p className="text-sm text-gray-400 mt-1">
                We'll notify you when something arrives
              </p>
            </div>
          )}

          {/* Notifications List */}
          {!isLoading && !error && filteredNotifications.length > 0 && (
            <div className="space-y-2">
              {/* All Tab View - Show sections */}
              {activeTab === "all" && (
                <>
                  {/* Alerts Section */}
                  {alertNotifications.length > 0 && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center px-2 py-1">
                        <h3 className="text-xs font-semibold text-red-600 uppercase flex items-center gap-1">
                          <FaExclamationTriangle size={10} /> Alerts
                        </h3>
                        {alertNotifications.some(
                          (n) => !isNotificationRead(n)
                        ) && (
                          <button
                            onClick={() => handleMarkCategoryAsRead("alert")}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      {alertNotifications.map(renderNotificationItem)}
                    </div>
                  )}

                  {/* General Notifications Section */}
                  {generalNotifications.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center px-2 py-1">
                        <h3 className="text-xs font-semibold text-blue-600 uppercase flex items-center gap-1">
                          <FaBell size={10} /> General
                        </h3>
                        {generalNotifications.some(
                          (n) => !isNotificationRead(n)
                        ) && (
                          <button
                            onClick={() => handleMarkCategoryAsRead("general")}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      {generalNotifications.map(renderNotificationItem)}
                    </div>
                  )}
                </>
              )}

              {/* Filtered Tab Views */}
              {activeTab !== "all" &&
                filteredNotifications.map(renderNotificationItem)}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t bg-white text-center text-xs text-gray-400">
        {activeTab === "all" &&
        notifications.every((n) => isNotificationRead(n))
          ? "All caught up!"
          : activeTab === "alert" &&
            alertNotifications.every((n) => isNotificationRead(n))
          ? "No unread alerts"
          : activeTab === "general" &&
            generalNotifications.every((n) => isNotificationRead(n))
          ? "No unread notifications"
          : `You have ${
              activeTab === "all"
                ? unreadCount
                : activeTab === "alert"
                ? unreadAlertCount
                : unreadGeneralCount
            } unread ${activeTab === "alert" ? "alert" : "notification"}${
              (activeTab === "all" && unreadCount !== 1) ||
              (activeTab === "alert" && unreadAlertCount !== 1) ||
              (activeTab === "general" && unreadGeneralCount !== 1)
                ? "s"
                : ""
            }`}
      </div>
    </div>
  );
};

export default NotificationsModal;
