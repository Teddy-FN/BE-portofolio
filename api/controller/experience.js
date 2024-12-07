const Experience = require("../models/experience");

exports.getExperience = async (req, res, next) => {
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

    const { count, rows } = await Experience.findAndCountAll(options);

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

// Get By ID
exports.getExperienceById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const data = await Experience.findOne({
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

exports.postExperience = async (req, res, next) => {
  const { start, end, placeWork, position, description, createdBy } = req.body;

  try {
    const existingSkill = await Experience.findOne({
      where: { company: placeWork },
    });
    if (existingSkill) {
      return res.status(400).json({ message: "Experience already exists" });
    }

    const newData = await Experience.create({
      company: placeWork,
      startDate: start,
      endDate: end,
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
  const {
    start,
    end,
    placeWork,
    position,
    description,
    createdBy,
    modifiedBy,
  } = req.body;

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
      existingData.company === placeWork &&
      existingData.startDate === start &&
      existingData.endDate === end &&
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
        company: placeWork,
        startDate: start,
        endDate: end,
        description,
        position,
        createdBy,
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

// Delete By ID
exports.deleteExperienceById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const existingData = await Experience.findOne({
      where: { id },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!existingData) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Hapus data
    await Experience.destroy({
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
