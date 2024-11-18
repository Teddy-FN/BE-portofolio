const Experience = require("../models/experience");

exports.getExperience = async (req, res, next) => {
  try {
    const getData = await Experience.findAll();
    return res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.postExperience = async (req, res, next) => {
  const { company, startDate, endDate, description, position, createdBy } =
    req.body;

  try {
    const newData = await Experience.create({
      company,
      startDate,
      endDate,
      description,
      position,
      createdBy,
    });
    return res.status(201).json({ message: "Success", data: newData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.editExperience = async (req, res, next) => {
  const { company, startDate, endDate, description, position, modifiedBy } =
    req.body;

  try {
    // Temukan data berdasarkan ID
    const existingData = await Experience.findOne({
      where: { id: req.params.id },
    });

    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Cek apakah data yang di-update sama dengan data yang sudah ada
    const isSameData =
      existingData.company === company &&
      existingData.startDate === startDate &&
      existingData.endDate === endDate &&
      existingData.description === description &&
      existingData.position === position;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update data jika ada perubahan
    await Experience.update(
      {
        company,
        startDate,
        endDate,
        description,
        position,
        modifiedBy,
      },
      { where: { id: req.params.id } }
    );

    // Ambil data terbaru setelah update
    const updatedData = await Experience.findOne({
      where: { id: req.params.id },
    });

    return res
      .status(200)
      .json({ message: "Update successful", data: updatedData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};