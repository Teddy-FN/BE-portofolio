const { google } = require("googleapis");
const Project = require("../models/project");
const fs = require("fs");

const CLIENT_ID =
  "141136956429-99c0hj1rcg4hej4dvain1vsb3lh53o54.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04_iF_x-FZ36ECgYIARAAGAQSNwF-L9Ir_AMpA8phmYWeEdiFaIz1knq2eDSoVfAk3FgISfP0KDCafyzg0Yw0zHSyDj6Ak-mr8K0";

// Load Google API credentials
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the credentials
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const folderId = "18NLVXWzBWsi3N_JEaDnDjWEBBwd0y2oA"; // Replace with your Google Drive folder ID

// Function to search for a file in Google Drive by name
const findFileByName = async (fileName) => {
  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and '${folderId}' in parents`,
      fields: "files(id, name)",
      spaces: "drive",
    });
    return response.data.files[0]; // Return the first matching file if found
  } catch (error) {
    throw new Error("Error searching for file on Google Drive");
  }
};

// Function to delete a file by its Google Drive file ID
const deleteFile = async (fileId) => {
  try {
    await drive.files.delete({ fileId });
  } catch (error) {
    throw new Error("Error deleting file from Google Drive");
  }
};

// Function to upload an image to Google Drive
const uploadImageToDrive = async (filePath, fileName) => {
  const accessTokenInfo = await oauth2Client.getAccessToken();

  if (!accessTokenInfo.token) {
    throw new Error("Failed to obtain access token");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream(filePath),
  };

  try {
    const { data: file } = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return `https://drive.google.com/uc?id=${file.id}`;
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

// Use the access token for the Drive API
const drive = google.drive({ version: "v3", auth: oauth2Client });

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
