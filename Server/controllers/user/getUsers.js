import User from "../../models/userModel.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default getUsers;
