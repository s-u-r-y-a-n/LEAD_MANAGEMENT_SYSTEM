import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


const app = express();

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;


// Middlewares
app.use(cookieParser());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


