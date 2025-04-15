import { NextResponse } from "next/server"
import dbconnect from "@/lib/connectdb/connection"
import Notification from "@/lib/models/Notification"

/**
 * GET /api/notifications?userId=USER_ID
 * GET /api/notifications/count?userId=USER_ID
 *
 * Fetch notifications for a specific user or get unread count
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const countOnly = searchParams.get("count") === "true"

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await dbconnect()

    // If count parameter is true, return only the count of unread notifications
    if (countOnly) {
      console.log("Fetching unread notification count for user:", userId)
      const count = await Notification.countDocuments({
        userId,
        isRead: false,
      })
      console.log(`Found ${count} unread notifications for user ${userId}`)
      return NextResponse.json({ count }, { status: 200 })
    }

    // Otherwise, return all notifications for the user
    console.log("Fetching notifications for user:", userId)
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).lean()

    console.log(`Found ${notifications.length} notifications for user ${userId}`)

    return NextResponse.json(
      notifications.map((n) => ({
        ...n,
        _id: n._id.toString(),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in GET /api/notifications:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

/**
 * POST /api/notifications
 * Create a new notification
 *
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for a user (optional category filter)
 */
export async function POST(req) {
  try {
    const body = await req.json()
    const { action } = body

    await dbconnect()

    // Handle marking all notifications as read
    if (action === "mark-all-read") {
      const { userId, category } = body

      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 })
      }

      console.log(`Marking all notifications as read for user: ${userId}${category ? `, category: ${category}` : ""}`)

      const query = { userId, isRead: false }
      if (category) {
        query.category = category
      }

      const result = await Notification.updateMany(query, { isRead: true })
      console.log(`Marked ${result.modifiedCount} notifications as read`)

      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 })
    }

    // Handle creating a new notification
    const { userId, title, message, category, type, priority, isRead } = body

    if (!userId || !title || !message || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Creating notification for user:", userId)

    const notification = new Notification({
      userId,
      title,
      message,
      category,
      type: type || "info",
      priority: priority || "low",
      isRead: isRead || false,
    })

    await notification.save()
    console.log("Notification created:", notification._id)

    return NextResponse.json({
      ...notification.toObject(),
      _id: notification._id.toString(),
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error("Error in POST /api/notifications:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

/**
 * PATCH /api/notifications
 * Mark a notification as read
 */
export async function PATCH(req) {
  try {
    const body = await req.json()
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    console.log("Marking notification as read:", notificationId)
    await dbconnect()

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    ).lean()

    if (!updatedNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    console.log("Notification marked as read:", notificationId)
    return NextResponse.json(
      {
        ...updatedNotification,
        _id: updatedNotification._id.toString(),
        createdAt: updatedNotification.createdAt.toISOString(),
        updatedAt: updatedNotification.updatedAt.toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in PATCH /api/notifications:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}

