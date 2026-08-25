import Admin from "../../models/adminModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createAdmin = async (req, res) => {
  console.log(process.env.ADMIN_USERNAME);
  try {
    const username = normalizeText(process.env.ADMIN_USERNAME);
    const email = normalizeEmail(process.env.ADMIN_EMAIL);
    const password = normalizeText(process.env.ADMIN_PASSWORD);

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Please provide an admin username.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an admin email address.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

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

    const existingAdmin = await Admin.findOne({
      where: {
        email,
      },
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email address already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      admin,
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// createAdmin();

export default createAdmin;
