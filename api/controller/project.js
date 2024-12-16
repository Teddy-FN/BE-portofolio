const { google } = require("googleapis");
const Project = require("../models/project");
const fs = require("fs");

const CLIENT_ID =
  "141136956429-99c0hj1rcg4hej4dvain1vsb3lh53o54.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04uGGBnZmyskPCgYIARAAGAQSNwF-L9IrrZrqCBZZlKGaJV9CgaRScDBmtsYUGK3KigT3qLzlRuP2rJKTFhDQhx8CdWQZSTBpJD8";

// Load Google API credentials
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the credentials
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const folderId = "18NLVXWzBWsi3N_JEaDnDjWEBBwd0y2oA"; // Replace with your Google Drive folder ID
// Use the access token for the Drive API
const drive = google.drive({ version: "v3", auth: oauth2Client });

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
    console.error("Error during file search:", error.message);
    throw new Error("Error searching for file on Google Drive");
  }
};

// Function to delete a file by its Google Drive file ID
const deleteFile = async (fileId) => {
  try {
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error("Error during file deletion:", error.message);
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
    console.error("Error during file upload:", error.message);
    throw new Error("Failed to upload image");
  }
};

exports.getProjectByCategory = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { category } = req.params;

    // Cari data berdasarkan category
    const data = await Project.findAll({
      where: { category: category }, // Gunakan id sebagai kondisi
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Kirim respons dengan data yang ditemukan
    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isTable = false } = req.query;

    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    let options = {};

    if (isTable === "true") {
      options = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      };
    }

    const { count, rows } = await Project.findAndCountAll(options);

    return res.status(200).json({
      message: "Success",
      data: rows,
      meta:
        isTable === "true"
          ? {
              totalItems: count,
              totalPages: Math.ceil(count / pageSize),
              currentPage,
            }
          : null,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.postProject = async (req, res) => {
  const {
    category,
    stack,
    title,
    description,
    live,
    status,
    github,
    createdBy,
  } = req.body;

  try {
    const imageFile = req.file;

    // Cek apakah title sudah ada di tabel
    const existingProject = await Project.findOne({ where: { title } });
    if (existingProject) {
      return res.status(400).json({ message: "Project title already exists" });
    }

    let imageUrl = null;

    if (imageFile) {
      // Periksa apakah file dengan nama yang sama sudah ada di Google Drive
      const existingFile = await findFileByName(imageFile.originalname);

      // Jika file ada, hapus file lama dari Google Drive
      if (existingFile) {
        await deleteFile(existingFile.id);
      }

      // Unggah gambar baru ke Google Drive
      imageUrl = await uploadImageToDrive(
        imageFile.path,
        imageFile.originalname
      );
    }

    // Validasi URL gambar
    const finalImageUrl = imageUrl;

    if (!finalImageUrl) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    // Buat entri baru di tabel Project
    const newProject = await Project.create({
      category,
      img: finalImageUrl,
      title,
      description,
      stack: stack?.includes(",") ? stack?.split(",") : [stack],
      status,
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

// Get By ID
exports.getProjectById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const data = await Project.findOne({
      where: { id }, // Gunakan id sebagai kondisi
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Kirim respons dengan data yang ditemukan
    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.editProject = async (req, res) => {
  const { id } = req.params;
  const {
    category,
    img,
    title,
    description,
    live,
    status,
    stack,
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
      project.category === category &&
      project.img === img &&
      project.title === title &&
      project.description === description &&
      project.status === status &&
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
        category,
        img,
        title,
        description,
        stack: stack?.includes(",") ? stack?.split(",") : [stack],
        live,
        status,
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

exports.deleteProject = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const existingData = await Project.findOne({
      where: { id },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!existingData) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Hapus data
    await Project.destroy({
      where: { id },
    });

    // Kirim respons sukses
    return res.status(200).json({
      message: "Delete successful",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};
