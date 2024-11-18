require("dotenv").config({ path: `${process.cwd()}/.env` });
const PORT = process.env.APP_PORT || 7000;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
const descriptionRoutes = require("./routes/description");
const greetingsRoutes = require("./routes/greetings");
const aboutMeRoutes = require("./routes/about-me");
const educationRoutes = require("./routes/education");
const experienceRoutes = require("./routes/experience");
const skillsRoutes = require("./routes/skills");
const projectRoutes = require("./routes/project");
const stackRoutes = require("./routes/stack");

app.use("/description", descriptionRoutes);
app.use("/greeting", greetingsRoutes);
app.use("/about-me", aboutMeRoutes);
app.use("/education", educationRoutes);
app.use("/experience", experienceRoutes);
app.use("/skills", skillsRoutes);
app.use("/project", projectRoutes);
app.use("/stack", stackRoutes);

// Error Handling for undefined routes
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "Fail",
    message: "Route Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`APP IS RUNNING on PORT ${PORT}`);
});
