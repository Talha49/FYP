const express = require("express");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");
const config = require("../config/firebase.config");
const VideoModel = require("../models/VideoModel");
const { spawn } = require("child_process");

const videoRouter = express.Router();

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

videoRouter.post("/upload", upload.single("video"), async (req, res) => {
  try {
    console.log("Received video upload request");

    if (!req.file) {
      console.log("No file received");
      return res.status(400).send({ message: "No file received" });
    }

    const dateTime = new Date().toISOString();
    const storageRef = ref(
      storage,
      `videos/${req.file.originalname}_${dateTime}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    console.log("Uploading video to Firebase...");
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File Uploaded successfully:", downloadURL);

    // Call the Python script to process the video
    const pythonProcess = spawn("python", ["main.py", downloadURL]);
    let pythonOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      console.log(`Python script exited with code: ${code}`);
      if (code === 0) {
        try {
          const responseData = JSON.parse(pythonOutput);
          const newVideo = new VideoModel({
            video_url: downloadURL,
          });
          await newVideo.save();
          res
            .status(200)
            .json({ newVideo, frame_points: responseData });
        } catch (error) {
          console.error("Error parsing Python script output:", error);
          res.status(500).send({
            message: "Error processing video.",
            error: error.message,
          });
        }
      } else {
        res.status(500).send({
          message: "Python script failed.",
          error: `Script exited with code ${code}`,
        });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).send({
      message: "File upload failed.",
      error: error.message,
    });
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

module.exports = videoRouter;
