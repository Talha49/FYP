const express = require("express");
const InfoSpotModel = require("../models/InfoSpotModel");

const infoSpotRouter = express.Router();

// Route to get all infospots for a specific video
infoSpotRouter.get("/:video_id", async (req, res) => {
  try {
    const { video_id } = req.params;
    const infospots = await InfoSpotModel.find({ video_id });
    res.status(200).json(infospots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create infospot
infoSpotRouter.post("/create", async (req, res) => {
  try {
    const {
      title,
      description,
      position_x,
      position_y,
      position_z,
      video_id,
      panorama_id,
    } = req.body;
    const newInfospot = new InfoSpotModel({
      title,
      description,
      position_x,
      position_y,
      position_z,
      video_id,
      panorama_id,
    });

    await newInfospot.save();
    res.status(201).json(newInfospot);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
});

// Route to Update Infospot
infoSpotRouter.put("/update/:infospotID", async (req, res) => {
  const { infospotID } = req.params;
  const { title, description } = req.body; // Assuming these are the fields you want to update

  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please fillout the fields first" });
    } else {
      // Find the infospot by ID and update it
      const updatedInfospot = await InfoSpotModel.findByIdAndUpdate(
        infospotID,
        { title, description },
        { new: true } // This option returns the updated document
      );
      if (!updatedInfospot) {
        return res.status(404).json({ message: "Infospot not found" });
      }
      res.status(200).json(updatedInfospot);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete specific infospot
infoSpotRouter.delete("/delete/:infospotID", async (req, res) => {
  const { infospotID } = req.params;

  try {
    if (!infospotID) {
      return res.status(400).json({ message: "Infospot ID is required." });
    }

    const deletedInfospot = await InfoSpotModel.findByIdAndDelete(infospotID);

    if (!deletedInfospot) {
      return res.status(404).json({ message: "Infospot not found." });
    }

    res.status(200).json({ message: "Infospot deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = infoSpotRouter;
