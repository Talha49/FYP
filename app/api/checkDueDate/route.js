import dbconnect from "@/lib/connectdb/connection";
import NewTask from "@/lib/models/New";
import axios from "axios";
import { NextResponse } from "next/server";

const NOTIFY_API_URL = "http://localhost:3000/api/notifyApi"; // Update with actual URL

export async function GET() {
  console.log("⏳ Checking for due tasks...");

  try {
    await dbconnect(); // Connect to database
    console.log("✅ Database connected");

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    console.log(`📅 Searching for tasks due between ${today} and ${threeDaysLater}`);

    // Fetch tasks where dueDate is in 3 days and status is not "Completed"
    const dueTasks = await NewTask.find({
      dueDate: { $gte: today, $lte: threeDaysLater },
      status: { $ne: "Completed" },
    });

    if (!dueTasks.length) {
      console.log("✅ No pending tasks due soon.");
      return NextResponse.json({ message: "No pending tasks due soon." }, { status: 200 });
    }

    console.log(`🔍 Found ${dueTasks.length} due tasks`);

    for (const task of dueTasks) {
      console.log(`📌 Checking task: "${task.description || "No Description"}" (ID: ${task._id})`);

      // Check if the task has assignees
      if (!task.assignees || task.assignees.length === 0) {
        console.log(`⚠️ Task "${task.description}" has no assignees.`);
        continue;
      }

      // Send notifications to all assignees
      for (const assignee of task.assignees) {
        if (!assignee.id) {
          console.log(`⚠️ Assignee for task "${task.description}" has no user ID.`);
          continue;
        }

        console.log(`🔔 Sending notification for task: "${task.description}" to user ${assignee.id}`);

        try {
          const notifyResponse = await axios.post(NOTIFY_API_URL, {
            userId: assignee.id,
            title: "⏳ Task Due in 3 Days! ⏳",
            message: `🚀 Your task "**${task.description}**" is due in **3 days**! Please take action. 🔥`,
            templateName: "task_due_reminder",
            priority: "high",
            type: "welcome",
            category:"alert",
          });

          console.log(`✅ Notification sent to user ${assignee.id}:`, notifyResponse.data);
        } catch (error) {
          console.error(`❌ Error sending notification to ${assignee.id}:`, error.response?.data || error.message);
        }
      }

      // Notify the creator about the due task
      if (task.creatorId) {
        console.log(`📧 Sending notification to task creator (ID: ${task.creatorId})`);

        try {
          const notifyResponse = await axios.post(NOTIFY_API_URL, {
            userId: task.creatorId,
            title: "⚠️ Task You Assigned is Approaching Due Date!",
            message: `🚨 The task you assigned to **${task.assignees.map(a => a.name).join(", ")}** is approaching its due date! 📅\n\n
            Kindly contact your team to get an update on the progress. ✅\n\n
            **Task:** ${task.description}\n
            **Due Date:** ${task.dueDate.toDateString()}\n
            📞 Please follow up as soon as possible!`,
            templateName: "task_due_creator_reminder",
          
            priority: "high",
            type: "welcome",
            category:"alert",
          });

          console.log(`✅ Notification sent to task creator (ID: ${task.creatorId}):`, notifyResponse.data);
        } catch (error) {
          console.error(`❌ Error sending notification to creator ${task.creatorId}:`, error.response?.data || error.message);
        }
      }
    }

    return NextResponse.json({ message: "Notifications sent successfully." }, { status: 200 });

  } catch (error) {
    console.error("❌ Error checking due tasks:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
