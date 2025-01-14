const StatusProject = require("../models/status-project");

exports.getStatusProject = async (req, res, next) => {
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

    const { count, rows } = await StatusProject.findAndCountAll(options);

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

exports.postStatusProject = async (req, res, next) => {
  const { name, createdBy } = req.body;

  try {
    const existingSkill = await StatusProject.findOne({ where: { name } });
    if (existingSkill) {
      return res.status(400).json({ message: "Skill name already exists" });
    }

    const newData = await StatusProject.create({
      name,
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

// Get By ID
exports.getStatusProjectById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const data = await StatusProject.findOne({
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

exports.editStatusProject = async (req, res, next) => {
  const { name, createdBy, modifiedBy } = req.body;

  try {
    // Temukan data berdasarkan ID
    const existingData = await StatusProject.findOne({
      where: { id: req.params.id },
    });

    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Cek apakah data yang di-update sama dengan data yang sudah ada
    const isSameData = existingData.name === name;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update data jika ada perubahan
    await StatusProject.update(
      {
        name,
        createdBy,
        modifiedBy,
      },
      { where: { id: req.params.id } }
    );

    // Ambil data terbaru setelah update
    const updatedData = await StatusProject.findOne({
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
exports.deleteStatusProjectById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const existingData = await StatusProject.findOne({
      where: { id },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!existingData) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Hapus data
    await StatusProject.destroy({
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
