import Lead from "../../models/leadModel.js";

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
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
