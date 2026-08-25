import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createUser = async (req, res) => {
  try {
    const username = normalizeText(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = normalizeText(req.body.password);

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Please enter a username.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email address already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default createUser;
