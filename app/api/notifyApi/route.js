// File: "@/app/api/notifyApi/route.js"
import dbconnect from "@/lib/connectdb/connection";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";
import nodemailer from "nodemailer";
import axios from "axios";
import { NextResponse } from "next/server";

const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0/595245460339458/messages";

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Handle POST requests
export async function POST(req) {
  console.log("Received POST request");

  const { userId, title, message, templateName } = await req.json(); // Use req.json() to parse the body
  console.log("Request body:", { userId, title, message, templateName });

  if (!userId || !title || !message || !templateName) {
    console.log("Missing required fields");
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    console.log("Connecting to the database...");
    await dbconnect();
    console.log("Database connected");

    // Fetch the user data using the userId
    console.log("Fetching user data for userId:", userId);
    const user = await User.findOne({ _id: userId });


    if (!user) {
      console.log("User not found for userId:", userId);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("User found:", user);

    // Create a new notification document
    console.log("Creating notification document...");
    const notification = await Notification.create({
      userId,
      title,
      message,
    });
    console.log("Notification created:", notification);

    // Send Email Notification
    if (user.email) {
      console.log(`Sending email to: ${user.email}`);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: title,
        text: message,
      });

      // Update notification status to indicate email was sent
      console.log("Email sent, updating notification status...");
      await Notification.updateOne(
        { _id: notification._id },
        { sentEmail: true }
      );
    } else {
      console.log("User has no email, skipping email notification");
    }

// Send WhatsApp Notification
if (user.contact) {
  console.log(`Sending WhatsApp message to: ${user.contact}`);

  try {
    const whatsappResponse = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: user.contact.replace("+", ""), // Remove + sign if present
        type: "template",
        template: {
            name: templateName, // ✅ Use the template name from frontend
          language: { code: "en" }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

  
      // Log the response from WhatsApp API
      console.log("WhatsApp API Response:", whatsappResponse.data);
  
      // Check if the API response contains errors
      if (whatsappResponse.data.error) {
        console.log("WhatsApp message failed:", whatsappResponse.data.error);
      } else {
        console.log("WhatsApp message sent successfully!");
      }
  
    } catch (error) {
      // Log any error during the API call
      console.error("Error sending WhatsApp message:", error.response?.data || error.message);
    }


      // Update notification status to indicate WhatsApp message was sent
      console.log("WhatsApp message sent, updating notification status...");
      await Notification.updateOne(
        { _id: notification._id },
        { sentWhatsApp: true }
      );
    } else {
      console.log("User has no contact number, skipping WhatsApp notification");
    }

    // Return response indicating success
    console.log("Notification sent successfully, returning response...");
    return NextResponse.json(
      { message: "Notification sent!", notification },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
