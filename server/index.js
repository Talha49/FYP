const express = require("express");
const { connection } = require("./db");
require("dotenv").config();
const cors = require("cors");
const infoSpotRouter = require("./routes/route.infospot");
const panoramaRouter = require("./routes/route.panorama");
const videoRouter = require("./routes/route.video");


const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Server is Up");
});

app.use("/infospots", infoSpotRouter);
app.use("/panorama", panoramaRouter);
app.use("/video", videoRouter)

app.listen(port, async (req, res) => {
  try {
    await connection;
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
  console.log(`Virtual Tour Server is running on port ${port}`);
});
