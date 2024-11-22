const { google } = require("googleapis");
const fs = require("fs");
const AboutMe = require("../models/about_me");

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

const folderId = "1FAPnhTWwgP8U7JgL7rZYMKlJLslaI3J6"; // Replace with your Google Drive folder ID

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

exports.getAboutMe = async (req, res, next) => {
  try {
    const getData = await AboutMe.findOne();
    return res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
    return res.end();
  }
};

exports.postAboutMe = async (req, res, next) => {
  const {
    image,
    name,
    experience,
    email,
    nationality,
    freelance,
    languages,
    createdBy,
  } = req.body;
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

    const getData = await AboutMe.create({
      photo: imageUrl || image, // Use the uploaded image URL or fallback to provided image
      name,
      experience,
      email,
      nationality,
      freelance,
      languages,
      createdBy,
    });
    return res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
    return res.end();
  }
};

exports.editAboutMe = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    experience,
    email,
    nationality,
    freelance,
    languages,
    modifiedBy,
  } = req.body;
  const imageFile = req.file;

  try {
    // Temukan data yang ada berdasarkan ID
    const existingData = await AboutMe.findByPk(id);

    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    let imageUrl = existingData.photo;

    // Jika ada file baru yang diupload
    if (imageFile) {
      // Cari file lama berdasarkan nama foto di Google Drive
      const oldFileIdMatch = imageUrl.match(/id=([^&]+)/);
      if (oldFileIdMatch) {
        const oldFileId = oldFileIdMatch[1];
        // Hapus file lama dari Google Drive
        await deleteFile(oldFileId);
      }

      // Upload foto baru ke Google Drive
      imageUrl = await uploadImageToDrive(
        imageFile.path,
        imageFile.originalname
      );
    }

    // Cek apakah data baru sama dengan data lama
    const isSameData =
      existingData.name === name &&
      existingData.experience === experience &&
      existingData.email === email &&
      existingData.nationality === nationality &&
      existingData.freelance === freelance &&
      JSON.stringify(existingData.languages) === JSON.stringify(languages) &&
      existingData.photo === imageUrl;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update data pengguna dengan data baru
    await existingData.update({
      name,
      experience,
      email,
      nationality,
      freelance,
      languages,
      photo: imageUrl,
      modifiedBy,
    });

    return res
      .status(200)
      .json({ message: "Update successful", data: existingData });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
