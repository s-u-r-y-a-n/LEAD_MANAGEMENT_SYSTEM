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

const createLead = async (req, res) => {
  try {
    const firstName = normalizeText(req.body.firstName);
    const lastName = normalizeText(req.body.lastName);
    const companyName = normalizeText(req.body.companyName);
    const leadSource = normalizeText(req.body.leadSource);
    const status = normalizeText(req.body.status) || "New";
    const priority = normalizeText(req.body.priority) || "Medium";
    const assignedUser = normalizeText(req.body.assignedUser);

    const email = normalizeEmail(req.body.email);
    const phone = normalizeText(req.body.phone);
    const notes = normalizeText(req.body.notes);

    const expectedValue = req.body.expectedValue;
    const expectedCloseDate = req.body.expectedCloseDate;

    if (!firstName) {
      return res.status(400).json({
        success: false,
        message: "Please enter the lead's first name.",
      });
    }

    if (!lastName) {
      return res.status(400).json({
        success: false,
        message: "Please enter the lead's last name.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the lead's email address.",
      });
    }

    if (!leadSource) {
      return res.status(400).json({
        success: false,
        message: "Please select a lead source.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!LEAD_SOURCES.includes(leadSource)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead source.",
      });
    }

    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status.",
      });
    }

    if (!PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead priority.",
      });
    }

    let parsedExpectedValue = null;

    if (
      expectedValue !== undefined &&
      expectedValue !== null &&
      expectedValue !== ""
    ) {
      parsedExpectedValue = Number(expectedValue);

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

    let parsedCloseDate = null;

    if (expectedCloseDate) {
      parsedCloseDate = new Date(expectedCloseDate);

      if (Number.isNaN(parsedCloseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid expected close date.",
        });
      }
    }

    const existingLead = await Lead.findOne({
      where: {
        email,
      },
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email address already exists.",
      });
    }

    const lastLead = await Lead.findOne({
      order: [["leadNumber", "DESC"]],
    });

    let nextNumber = 1;

    if (lastLead) {
      const lastNumber = Number.parseInt(
        lastLead.leadNumber.replace(/^LEAD-/, ""),
        10,
      );

      if (Number.isFinite(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const leadNumber = `LEAD-${String(nextNumber).padStart(5, "0")}`;

    const lead = await Lead.create({
      leadNumber,
      firstName,
      lastName,
      companyName: companyName || null,
      leadSource,
      status,
      priority,
      assignedUser: assignedUser || null,
      expectedValue: parsedExpectedValue,
      expectedCloseDate: parsedCloseDate,
      notes: notes || null,
      email,
      phone: phone || null,
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default createLead;
