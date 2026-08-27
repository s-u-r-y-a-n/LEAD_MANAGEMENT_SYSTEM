import Lead from "./models/leadModel.js";
import sequelize from "./config/db.js";

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

const FIRST_NAMES = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emma",
  "Daniel",
  "Olivia",
  "James",
  "Sophia",
  "William",
  "Ava",
  "Alexander",
  "Mia",
  "Robert",
  "Isabella",
  "Thomas",
  "Charlotte",
  "Christopher",
  "Amelia",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Walker",
  "Hall",
  "Allen",
  "Young",
  "King",
];

const COMPANIES = [
  "Acme Technologies",
  "Bluewave Solutions",
  "Nova Systems",
  "Greenfield Industries",
  "Vertex Digital",
  "CloudNine Technologies",
  "BrightStar Solutions",
  "Summit Enterprises",
  "Pioneer Labs",
  "NextGen Systems",
  "Evergreen Solutions",
  "TechNova",
  "GlobalEdge",
  "Silverline Technologies",
  "PrimeWorks",
];

const NOTES = [
  "Interested in our premium package.",
  "Requested a product demonstration.",
  "Follow up next week.",
  "Looking for a long-term solution.",
  "Currently comparing different vendors.",
  "Very interested in moving forward.",
  "Requested pricing information.",
  "Initial consultation completed.",
  "Waiting for management approval.",
  "Needs additional information before proceeding.",
];

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generatePhone = () => {
  return `+91${randomNumber(6000000000, 9999999999)}`;
};

const generateExpectedCloseDate = () => {
  const date = new Date();

  const daysToAdd = randomNumber(7, 120);

  date.setDate(date.getDate() + daysToAdd);

  return date;
};

const createLeads = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected.");

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

    // Randomly create between 30 and 35 leads
    const numberOfLeads = randomNumber(30, 35);

    const leads = [];

    for (let i = 0; i < numberOfLeads; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${nextNumber}@example.com`;

      const lead = {
        leadNumber: `LEAD-${String(nextNumber).padStart(5, "0")}`,

        firstName,

        lastName,

        companyName: randomItem(COMPANIES),

        leadSource: randomItem(LEAD_SOURCES),

        status: randomItem(STATUSES),

        priority: randomItem(PRIORITIES),

        // Assignment will be handled by an admin
        assignedUser: null,

        assignedUserId: null,

        expectedValue: randomNumber(10000, 500000),

        expectedCloseDate: generateExpectedCloseDate(),

        notes: randomItem(NOTES),

        email,

        phone: generatePhone(),
      };

      leads.push(lead);

      nextNumber++;
    }

    // Bulk insert all leads at once
    const createdLeads = await Lead.bulkCreate(leads);

    console.log(`Successfully created ${createdLeads.length} leads.`);

    console.table(
      createdLeads.map((lead) => ({
        leadNumber: lead.leadNumber,
        name: `${lead.firstName} ${lead.lastName}`,
        company: lead.companyName,
        source: lead.leadSource,
        status: lead.status,
        priority: lead.priority,
        value: lead.expectedValue,
      })),
    );
  } catch (error) {
    console.error("Failed to create leads:", error);
  } finally {
    await sequelize.close();
  }
};

createLeads();
