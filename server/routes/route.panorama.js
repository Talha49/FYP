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
const PanoramaModel = require("../models/PanoramaModel");

const panoramaRouter = express.Router();

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

panoramaRouter.post("/upload", upload.single("panorama"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("Request file:", req.file); // Log the file object

    if (!req.file) {
      return res.status(400).send({ message: "No file received" });
    }

    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `panoramas/${req.file.originalname} ${dateTime}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File Uploaded successfully.");

    const newPanorama = new PanoramaModel({
      panorama_url: downloadURL,
    });

    const savedPanorama = await newPanorama.save();

    return res.send({
      message: "Panorama uploaded sccessfully.",
      name: req.file.originalname,
      panoramaID: savedPanorama._id,
      panoramaURL: downloadURL,
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

// Get all panoramas
panoramaRouter.get('/all', async (req, res) => {
  try {
    const panoramas = await PanoramaModel.find();
    res.json(panoramas);
  } catch (error) {
    console.error('Error fetching panoramas:', error);
    res.status(500).json({ error: 'Failed to fetch panoramas' });
  }
});


module.exports = panoramaRouter;
