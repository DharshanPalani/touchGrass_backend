import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.js";
import userRouter from "./routes/user/user.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/user", userRouter);

try {
  pool.query(`
       CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
       ); 
    `);
} catch (error) {
  console.log("Error at pool query: " + error);
}

app.listen(3000);
