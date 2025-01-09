require("dotenv").config({ path: `${process.cwd()}/.env` });
const PORT = process.env.APP_PORT || 7000;
// const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser());
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
const serviceRoutes = require("./routes/service");
const statsRoutes = require("./routes/stats");
const statusProjectRoutes = require("./routes/statusProject");
const certificateRoutes = require("./routes/certificate");
const dashboardRoutes = require("./routes/dashboard");

app.use("/description", descriptionRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/greeting", greetingsRoutes);
app.use("/about-me", aboutMeRoutes);
app.use("/education", educationRoutes);
app.use("/experience", experienceRoutes);
app.use("/skills", skillsRoutes);
app.use("/project", projectRoutes);
app.use("/stack", stackRoutes);
app.use("/service", serviceRoutes);
app.use("/stats", statsRoutes);
app.use("/status-project", statusProjectRoutes);
app.use("/certificate", certificateRoutes);

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
