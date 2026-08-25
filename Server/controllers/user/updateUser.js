import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};

    if (req.body.username !== undefined) {
      const username = normalizeText(req.body.username);

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Please enter a username.",
        });
      }

      updateData.username = username;
    }

    if (req.body.email !== undefined) {
      const email = normalizeEmail(req.body.email);

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Please enter your email address.",
        });
      }

      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      const existingUser = await User.findOne({
        where: {
          email,
        },
      });

      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({
          success: false,
          message: "Email address already in use.",
        });
      }

      updateData.email = email;
    }

    if (req.body.password !== undefined) {
      const password = normalizeText(req.body.password);

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Please enter a password.",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long.",
        });
      }

      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default updateUser;
