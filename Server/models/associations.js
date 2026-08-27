import User from "./userModel.js";
import Lead from "./leadModel.js";

User.hasMany(Lead, {
  foreignKey: "assignedUserId",
  as: "assignedLeads",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Lead.belongsTo(User, {
  foreignKey: "assignedUserId",
  as: "assignee",
});
