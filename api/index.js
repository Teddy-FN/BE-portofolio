require("dotenv").config({ path: `${process.cwd()}/.env` });
const PORT = process.env.APP_PORT || 7000;

const express = require("express");

const app = express();

// Routes
const descriptionRoutes = require("./routes/description");

app.use("/description", descriptionRoutes);

// Error App
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "Fail",
    message: "Route Not Found",
  });
});

app.listen(PORT, () => {
  console.log("APP IS RUNNING");
});
