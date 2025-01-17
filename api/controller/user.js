/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const User = require("../models/user");
const generateToken = require("../../utils/jwtConvert");
const { Op } = require("sequelize");

// Register
exports.register = async (req, res, next) => {
  const body = req.body;
  try {
    const findUser = await User.findOne({
      where: {
        [Op.or]: [{ userName: body.userName }, { email: body.email }],
      },
    });

    if (findUser) {
      return res.status(401).json({
        message: "User Name / Email & Ditemukan",
      });
    }

    const newUser = await User.create({
      userType: body.userType,
      userName: body.userName,
      email: body.email,
      password: body.password,
    });

    return res.status(201).json({
      message: "Register created successfully",
      data: newUser,
    });
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

// Login
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
    if (!findUser || body.password !== findUser.password) {
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

// Logout
exports.logout = async (req, res, next) => {
  try {
    const body = req.body;

    // Find user by email or userName and store ID
    const findUser = await User.findOne({
      where: {
        id: body.id, // Ensure it matches the store
      },
    });

    // If user is found, update status to inactive
    if (findUser) {
      await User.update(
        { statusActive: false }, // Set status to inactive
        {
          where: {
            id: body.id,
          },
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
