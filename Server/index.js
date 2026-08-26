import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import Admin from "./models/adminModel.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(userRoutes);
app.use(leadRoutes);
app.use(adminRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL database connected successfully");

    await sequelize.sync();
    console.log("All tables synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

startServer();
