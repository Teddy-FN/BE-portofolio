const Service = require("../models/service");

exports.getService = async (req, res, next) => {
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

    const { count, rows } = await Service.findAndCountAll(options);

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

exports.postService = async (req, res, next) => {
  const { name, description, createdBy } = req.body;

  try {
    const newData = await Service.create({
      name,
      description,
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
exports.getServiceById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const data = await Service.findOne({
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

exports.editService = async (req, res, next) => {
  const { name, description, createdBy, modifiedBy } = req.body;

  try {
    // Temukan data berdasarkan ID
    const existingData = await Service.findOne({
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
    await Service.update(
      {
        name,
        description,
        createdBy,
        modifiedBy,
      },
      { where: { id: req.params.id } }
    );

    // Ambil data terbaru setelah update
    const updatedData = await Service.findOne({
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
exports.deleteServiceById = async (req, res, next) => {
  try {
    // Ambil ID dari parameter URL
    const { id } = req.params;

    // Cari data berdasarkan ID
    const existingData = await Service.findOne({
      where: { id },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!existingData) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    // Hapus data
    await Service.destroy({
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
