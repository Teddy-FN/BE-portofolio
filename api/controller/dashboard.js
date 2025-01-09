const Certificate = require("../models/certificate");
const Education = require("../models/education");
const Experience = require("../models/experience");
const Project = require("../models/project");
const Service = require("../models/service");
const Skill = require("../models/skills");

exports.getDashboard = async (req, res) => {
  try {
    const certificate = await Certificate.findAll();
    const education = await Education.findAll();
    const experience = await Experience.findAll();
    const project = await Project.findAll();
    const service = await Service.findAll();
    const skill = await Skill.findAll();

    const countData = [
      {
        name: "Certificate",
        total: certificate.length || 0,
      },
      {
        name: "Education",
        total: education.length || 0,
      },
      {
        name: "Experience",
        total: experience.length || 0,
      },
      {
        name: "Project",
        total: project.length || 0,
      },
      {
        name: "Service",
        total: service.length || 0,
      },
      {
        name: "Skill",
        total: skill.length || 0,
      },
    ];

    return res.status(200).json({ message: "Success", data: countData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
