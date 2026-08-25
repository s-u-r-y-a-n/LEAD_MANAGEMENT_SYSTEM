import Lead from "../../models/leadModel.js";

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    await lead.destroy();

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default deleteLead;
