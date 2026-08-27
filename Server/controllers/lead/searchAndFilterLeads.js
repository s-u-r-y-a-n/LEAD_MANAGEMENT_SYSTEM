import { Op } from "sequelize";
import Lead from "../../models/leadModel.js";
import User from "../../models/userModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const LEAD_SOURCES = [
  "Website",
  "Google Ads",
  "Facebook",
  "Referral",
  "Phone",
  "Email",
  "Other",
];

const STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const PRIORITIES = ["High", "Medium", "Low"];

const searchAndFilterLeads = async (req, res) => {
  try {
    const search = normalizeText(req.query.search);
    const status = normalizeText(req.query.status);
    const leadSource = normalizeText(req.query.leadSource);
    const priority = normalizeText(req.query.priority);
    const assignedUserId = normalizeText(req.query.assignedUserId);

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid lead status." });
    }

    if (leadSource && !LEAD_SOURCES.includes(leadSource)) {
      return res.status(400).json({ success: false, message: "Invalid lead source." });
    }

    if (priority && !PRIORITIES.includes(priority)) {
      return res.status(400).json({ success: false, message: "Invalid lead priority." });
    }

    const where = {};

    if (req.user.role !== "admin") {
      where.assignedUserId = req.user.id;
    } else if (assignedUserId) {
      where.assignedUserId = assignedUserId;
    }

    if (status) where.status = status;
    if (leadSource) where.leadSource = leadSource;
    if (priority) where.priority = priority;

    if (search) {
      const searchTerm = `%${search}%`;
      where[Op.or] = [
        { leadNumber: { [Op.like]: searchTerm } },
        { firstName: { [Op.like]: searchTerm } },
        { lastName: { [Op.like]: searchTerm } },
        { email: { [Op.like]: searchTerm } },
        { phone: { [Op.like]: searchTerm } },
        { companyName: { [Op.like]: searchTerm } },
      ];
    }

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
    console.error("Search and filter leads error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default searchAndFilterLeads;
