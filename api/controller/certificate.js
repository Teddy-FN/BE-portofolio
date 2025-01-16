const { google } = require("googleapis");
const Certificate = require("../models/certificate");
const fs = require("fs");

const CLIENT_ID =
  "141136956429-99c0hj1rcg4hej4dvain1vsb3lh53o54.apps.googleusercontent.com";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04cssLRir1EZ3CgYIARAAGAQSNwF-L9IrxH1VJEE5axYll9gRRvMPX2lO0e7-PtDYOJ5v-UO-Yd4XUNmR3BAT1YtJQV3078EO2pc";

// Load Google API credentials
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the credentials
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const folderId = "1dztgUK8azSA7RtpfdZkJyS4xgr-LvxGs"; // Replace with your Google Drive folder ID
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
  console.log("accessTokenInfo =>", accessTokenInfo);

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

exports.getCertificateByCategory = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { category } = req.params;

    // Cari data berdasarkan category
    const data = await Certificate.findAll({
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

exports.getCertificate = async (req, res, next) => {
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

    const { count, rows } = await Certificate.findAndCountAll(options);

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

exports.postCertificate = async (req, res) => {
  const { type, description, createdBy } = req.body;

  try {
    const imageFile = req.file;

    let imageUrl = null;

    if (imageFile) {
      // Check if a file with the same name exists on Google Drive
      const existingFile = await findFileByName(imageFile.originalname);

      // If file exists, delete the old image from Google Drive
      if (existingFile) {
        await deleteFile(existingFile.id);
      }

      // Upload the new image to Google Drive and get the URL
      imageUrl = await uploadImageToDrive(
        imageFile.path,
        imageFile.originalname
      );
    }

    console.log("imageUrl =>", imageUrl);

    // Validasi URL gambar
    const finalImageUrl = imageUrl;

    if (!finalImageUrl) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    // Buat entri baru di tabel Certificate
    const newCertificate = await Certificate.create({
      image: finalImageUrl,
      description,
      type,
      createdBy,
    });

    return res.status(201).json({
      message: "Certificate created successfully",
      data: newCertificate,
    });
  } catch (error) {
    console.error("Error creating Certificate:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get By ID
exports.getCertificateById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const data = await Certificate.findOne({
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

exports.editCertificate = async (req, res) => {
  const { id } = req.params;
  const { image, type, description, createdBy, modifiedBy } = req.body;

  try {
    // Check if the Certificate exists
    const certificate = await Certificate.findByPk(id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Check if the data is unchanged
    const isSameData =
      certificate.image === image &&
      certificate.description === description &&
      certificate.type === type;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update Certificate data
    await certificate.update(
      {
        image,
        description,
        type,
        modifiedBy,
        createdBy,
      },
      { returning: true }
    );

    return res.status(200).json({
      message: "Certificate updated successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("Error updating Certificate:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const existingData = await Certificate.findOne({
      where: { id },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!existingData) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Hapus data
    await Certificate.destroy({
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
