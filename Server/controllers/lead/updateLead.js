import Lead from "../../models/leadModel.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Find lead
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const firstName =
      req.body.firstName !== undefined
        ? normalizeText(req.body.firstName)
        : undefined;

    const lastName =
      req.body.lastName !== undefined
        ? normalizeText(req.body.lastName)
        : undefined;

    const companyName =
      req.body.companyName !== undefined
        ? normalizeText(req.body.companyName)
        : undefined;

    const leadSource =
      req.body.leadSource !== undefined
        ? normalizeText(req.body.leadSource)
        : undefined;

    const status =
      req.body.status !== undefined
        ? normalizeText(req.body.status)
        : undefined;

    const priority =
      req.body.priority !== undefined
        ? normalizeText(req.body.priority)
        : undefined;

    const assignedUser =
      req.body.assignedUser !== undefined
        ? normalizeText(req.body.assignedUser)
        : undefined;

    const email =
      req.body.email !== undefined ? normalizeEmail(req.body.email) : undefined;

    const phone =
      req.body.phone !== undefined ? normalizeText(req.body.phone) : undefined;

    const notes =
      req.body.notes !== undefined ? normalizeText(req.body.notes) : undefined;

    if (firstName !== undefined && !firstName) {
      return res.status(400).json({
        success: false,
        message: "First name cannot be empty.",
      });
    }

    if (lastName !== undefined && !lastName) {
      return res.status(400).json({
        success: false,
        message: "Last name cannot be empty.",
      });
    }

    if (email !== undefined) {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty.",
        });
      }

      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      const existingLead = await Lead.findOne({
        where: {
          email,
        },
        attributes: ["id"],
      });

      if (existingLead && existingLead.id !== lead.id) {
        return res.status(409).json({
          success: false,
          message: "A lead with this email address already exists.",
        });
      }
    }

    if (leadSource !== undefined) {
      if (!LEAD_SOURCES.includes(leadSource)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lead source.",
        });
      }
    }

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lead status.",
        });
      }
    }

    if (priority !== undefined) {
      if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lead priority.",
        });
      }
    }

    let parsedExpectedValue;

    if (req.body.expectedValue !== undefined) {
      if (req.body.expectedValue === null || req.body.expectedValue === "") {
        parsedExpectedValue = null;
      } else {
        parsedExpectedValue = Number(req.body.expectedValue);

        if (Number.isNaN(parsedExpectedValue)) {
          return res.status(400).json({
            success: false,
            message: "Expected value must be a valid number.",
          });
        }

        if (parsedExpectedValue < 0) {
          return res.status(400).json({
            success: false,
            message: "Expected value cannot be negative.",
          });
        }
      }
    }

    let parsedCloseDate;

    if (req.body.expectedCloseDate !== undefined) {
      if (
        req.body.expectedCloseDate === null ||
        req.body.expectedCloseDate === ""
      ) {
        parsedCloseDate = null;
      } else {
        parsedCloseDate = new Date(req.body.expectedCloseDate);

        if (Number.isNaN(parsedCloseDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Please enter a valid expected close date.",
          });
        }
      }
    }

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (companyName !== undefined) {
      updateData.companyName = companyName || null;
    }

    if (leadSource !== undefined) updateData.leadSource = leadSource;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    if (assignedUser !== undefined) {
      updateData.assignedUser = assignedUser || null;
    }

    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (notes !== undefined) updateData.notes = notes || null;

    if (req.body.expectedValue !== undefined) {
      updateData.expectedValue = parsedExpectedValue;
    }

    if (req.body.expectedCloseDate !== undefined) {
      updateData.expectedCloseDate = parsedCloseDate;
    }

    await lead.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default updateLead;
