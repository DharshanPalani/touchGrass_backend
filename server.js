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
  pool.query(`
      CREATE TABLE IF NOT EXISTS profiles(
        id INT REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT
      )`);
  // pool.query(`
  //   ALTER TABLE profiles ADD COLUMN first_name VARCHAR(100);
  // ALTER TABLE profiles ADD COLUMN last_name VARCHAR(100);
  // ALTER TABLE profiles ADD COLUMN age INT;
  // ALTER TABLE profiles ADD COLUMN course VARCHAR(255);
  // ALTER TABLE profiles ADD COLUMN interested_in VARCHAR(255);
  // ALTER TABLE profiles ADD COLUMN relationship_status VARCHAR(50);
  //   `);
} catch (error) {
  console.log("Error at pool query: " + error);
}

app.listen(3000);
