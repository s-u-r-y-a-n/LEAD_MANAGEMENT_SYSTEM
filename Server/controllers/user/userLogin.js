import bcrypt from "bcryptjs";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";
import User from "../../models/userModel.js";
import { createAuthTokens } from "../../utils/authUtils.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = normalizeText(password);

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
      message: "Please enter your password.",
    });
  }

  try {
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(
      normalizedPassword,
      user.password,
    );
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = createAuthTokens(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export default userLogin;
