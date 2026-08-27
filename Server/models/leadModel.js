import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    leadNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leadSource: {
      type: DataTypes.STRING,
      allowNull: false,
      enum: [
        "Website",
        "Google Ads",
        "Facebook",
        "Referral",
        "Phone",
        "Email",
        "Other",
      ],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Won",
        "Lost",
      ],
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
      enum: ["High", "Medium", "Low"],
    },
    assignedUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    expectedValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    expectedCloseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "leads",
  },
);

export default Lead;
