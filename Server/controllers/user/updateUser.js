import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const username = normalizeText(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = normalizeText(req.body.password);

    if (!username) {
      return response.status(400).json({
        success: false,
        message: "Please enter a username.",
      });
    }

    if (!email) {
      return response.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return response.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!password) {
      return response.status(400).json({
        success: false,
        message: "Please enter a password.",
      });
    }

    if (password.length < 8) {
      return response.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
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
