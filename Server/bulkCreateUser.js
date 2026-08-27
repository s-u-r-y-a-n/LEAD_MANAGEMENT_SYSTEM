import bcrypt from "bcryptjs";
import sequelize from "./config/db.js";
import User from "./models/userModel.js";

const users = [
  {
    username: "John",
    email: "john@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Jane",
    email: "jane@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Bob",
    email: "bob@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Alice",
    email: "alice@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Michael",
    email: "michael@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Sarah",
    email: "sarah@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "David",
    email: "david@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Emma",
    email: "emma@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Daniel",
    email: "daniel@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Olivia",
    email: "olivia@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "James",
    email: "james@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Sophia",
    email: "sophia@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "William",
    email: "william@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Ava",
    email: "ava@example.com",
    password: "Password123",
    role: "user",
  },
  {
    username: "Alexander",
    email: "alexander@example.com",
    password: "Password123",
    role: "user",
  },
];

const createUsers = async (users) => {
  try {
    await sequelize.authenticate();

    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    await User.bulkCreate(usersWithHashedPasswords);

    console.log(`Successfully created ${users.length} users.`);
  } catch (error) {
    console.error("Failed to create users:", error);
  } finally {
    await sequelize.close();
  }
};

createUsers(users);
