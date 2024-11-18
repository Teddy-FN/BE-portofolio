const Project = require("../models/project");

exports.getProject = async (req, res, next) => {
  try {
    const getData = await Project.findOne();
    return res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
    return res.end();
  }
};

exports.postProject = async (req, res) => {
  const { num, category, img, title, description, live, github, createdBy } =
    req.body;

  try {
    const newProject = await Project.create({
      num,
      category,
      img,
      title,
      description,
      live,
      github,
      createdBy,
    });

    return res
      .status(201)
      .json({ message: "Project created successfully", data: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editProject = async (req, res) => {
  const { id } = req.params;
  const {
    num,
    category,
    img,
    title,
    description,
    live,
    github,
    createdBy,
    modifiedBy,
  } = req.body;

  try {
    // Check if the project exists
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the data is unchanged
    const isSameData =
      project.num === num &&
      project.category === category &&
      project.img === img &&
      project.title === title &&
      project.description === description &&
      project.live === live &&
      project.github === github &&
      project.createdBy === createdBy;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update project data
    const updatedProject = await project.update(
      {
        num,
        category,
        img,
        title,
        description,
        live,
        github,
        modifiedBy,
      },
      { returning: true }
    );

    return res
      .status(200)
      .json({ message: "Project updated successfully", data: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Soft delete the project
    await project.destroy();

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
