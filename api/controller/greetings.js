const AboutMe = require("../models/about_me");

exports.greetings = async (req, res, next) => {
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
