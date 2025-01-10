/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const User = require("../models/user");
const generateToken = require("../../utils/jwtConvert");

exports.login = async (req, res, next) => {
  const body = req.body;
  const bodyUserNameOrEmail = body.userName; // userName input from FE

  try {
    // Regex to check if the input is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bodyUserNameOrEmail);

    // Find user by either email or username
    const findUser = isEmail
      ? await User.findOne({
          where: {
            email: bodyUserNameOrEmail,
          },
        })
      : await User.findOne({
          where: {
            userName: bodyUserNameOrEmail,
          },
        });

    console.log("findUser =>", findUser);

    // If no user is found or password does not match
    if (!findUser || !body.password === findUser.password) {
      return res.status(401).json({
        message: "User Name / Email & Password Tidak Ditemukan",
      });
    }

    // Update the user's status to active
    await User.update(
      { statusActive: true },
      {
        where: isEmail
          ? { email: bodyUserNameOrEmail }
          : { userName: bodyUserNameOrEmail },
      }
    );

    // Generate a token for the user
    const getToken = generateToken({
      id: findUser.id,
    });

    // Set token in a cookie
    if (
      findUser.dataValues.userType !== "user" &&
      findUser.dataValues.userType !== "admin"
    ) {
      return res.status(200).json({
        message: "Success Login",
        token: getToken,
        user: findUser?.dataValues,
      });
    } else {
      return res.status(200).json({
        message: "Success Login",
        token: getToken,
        user: {
          ...findUser?.dataValues,
        },
      });
    }
  } catch (error) {
    console.log("ERROR BRAY =>", error);

    return res.status(500).json({
      message: "Terjadi Kesalahan Internal Server",
    });
  } finally {
    console.log("resEND");
    return res.end();
  }
};

// User Logout
exports.logout = async (req, res, next) => {
  try {
    const body = req.body;
    const bodyUserNameOrEmail = body?.userName || body?.email;
    const storeId = body?.store; // Store identifier passed from FE

    if (!bodyUserNameOrEmail || !storeId) {
      return res.status(400).json({
        message: "User Name / Email & Store ID Tidak Boleh Kosong",
      });
    }

    // Check if the input is an email or username using a regex
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bodyUserNameOrEmail);

    // Find user by email or userName and store ID
    const findUser = isEmail
      ? await User.findOne({
          where: {
            email: bodyUserNameOrEmail,
            store: storeId, // Ensure it matches the store
          },
        })
      : await User.findOne({
          where: {
            userName: bodyUserNameOrEmail,
            store: storeId,
          },
        });

    // If user is found, update status to inactive
    if (findUser) {
      await User.update(
        { statusActive: false }, // Set status to inactive
        {
          where: isEmail
            ? { email: bodyUserNameOrEmail, store: storeId }
            : { userName: bodyUserNameOrEmail, store: storeId },
        }
      );

      // Clear the token cookie
      res.clearCookie("token");

      return res.status(200).json({
        message: "User Berhasil Logout",
      });
    } else {
      return res.status(404).json({
        message: "User Tidak Ditemukan",
      });
    }
  } catch (error) {
    console.log("ERROR LOGOUT =>", error);
    return res.status(500).json({
      error: "Terjadi Kesalahan Internal Server",
    });
  } finally {
    console.log("resEND");
    return res.end();
  }
};
