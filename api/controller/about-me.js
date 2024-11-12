const AboutMe = require("../models/about_me");

exports.getAboutMe = async (req, res, next) => {
  try {
    const getData = await AboutMe.findAll();
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
    name,
    experience,
    email,
    nationality,
    freelance,
    languages,
    createdBy,
  } = req.body;
  try {
    const getData = await AboutMe.create({
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

exports.editAboutMe = async (req, res, next) => {
  const {
    name,
    experience,
    email,
    nationality,
    freelance,
    languages,
    createdBy,
    modifiedBy,
  } = req.body;

  try {
    const existingData = await AboutMe.findOne({
      where: { id: req.params.id },
    });

    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    const isSameData =
      existingData.name === name &&
      existingData.experience === experience &&
      existingData.email === email &&
      existingData.nationality === nationality &&
      existingData.freelance === freelance &&
      JSON.stringify(existingData.languages) === JSON.stringify(languages) &&
      existingData.createdBy === createdBy;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    const updatedData = await AboutMe.update(
      {
        name,
        experience,
        email,
        nationality,
        freelance,
        languages,
        modifiedBy,
      },
      { where: { id: req.params.id }, returning: true }
    );

    return res
      .status(200)
      .json({ message: "Update successful", data: updatedData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
    return res.end();
  }
};
