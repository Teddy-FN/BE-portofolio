require("dotenv").config({ path: `${process.cwd()}/.env` });
const PORT = process.env.APP_PORT || 7000,
  express = require("express"),
  cors = require("cors"),
  app = express(),
  corsOptions = {
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
const descriptionRoutes = require("./routes/description"),
  greetingsRoutes = require("./routes/greetings"),
  aboutMeRoutes = require("./routes/about-me"),
  educationRoutes = require("./routes/education"),
  experienceRoutes = require("./routes/experience"),
  skillsRoutes = require("./routes/skills"),
  projectRoutes = require("./routes/project"),
  stackRoutes = require("./routes/stack"),
  serviceRoutes = require("./routes/service"),
  statsRoutes = require("./routes/stats"),
  statusProjectRoutes = require("./routes/statusProject"),
  certificateRoutes = require("./routes/certificate"),
  dashboardRoutes = require("./routes/dashboard"),
  authRoutes = require("./routes/user");

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
app.use("/auth", authRoutes);

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
