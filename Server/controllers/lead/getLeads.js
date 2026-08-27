import Lead from "../../models/leadModel.js";
import User from "../../models/userModel.js";

const getLeads = async (req, res) => {
  try {
    const where =
      req.user.role === "admin" ? {} : { assignedUserId: req.user.id };

    const leads = await Lead.findAll({
      where,
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default getLeads;
