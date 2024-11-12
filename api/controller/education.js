const Education = require("../models/education");

exports.getEducation = async (req, res, next) => {
  try {
    const getData = await Education.findAll();
    return res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.postEducation = async (req, res, next) => {
  const { degree, startDate, endDate, institution, createdBy } = req.body;

  try {
    const getData = await Education.create({
      degree,
      startDate,
      endDate,
      institution,
      createdBy,
    });
    return res.status(201).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

exports.editEducation = async (req, res, next) => {
  const { degree, startDate, endDate, institution, modifiedBy } = req.body;

  try {
    // Temukan data berdasarkan ID
    const existingData = await Education.findOne({
      where: { id: req.params.id },
    });

    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Cek apakah data yang di-update sama dengan data yang sudah ada
    const isSameData =
      existingData.degree === degree &&
      existingData.startDate === startDate &&
      existingData.endDate === endDate &&
      existingData.institution === institution;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update data jika ada perubahan
    await Education.update(
      {
        degree,
        startDate,
        endDate,
        institution,
        modifiedBy,
      },
      { where: { id: req.params.id } }
    );

    // Ambil data terbaru setelah update
    const updatedData = await Education.findOne({
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
