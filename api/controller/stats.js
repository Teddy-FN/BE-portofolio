const Skills = require("../models/skills");
const Project = require("../models/project");
const AboutMe = require("../models/about_me");

exports.getAllStats = async (req, res, next) => {
  try {
    const getDataSkill = await Skills.findAll();
    const getDataProject = await Project.findAll();
    const getDataAboutMe = await AboutMe.findAll();

    const skillCount = getDataSkill.length;
    const projectCount = getDataProject.length;
    const experienceYears = getDataAboutMe[0]?.dataValues?.experience || 0;

    const data = [
      {
        numb: experienceYears || 0,
        text: "Years Experience",
      },
      {
        numb: projectCount || 0,
        text: "Project Completed",
      },
      {
        numb: skillCount || 0,
        text: "Technologies Mastered",
      },
    ];

    console.log("Generated Data:", data);

    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};
