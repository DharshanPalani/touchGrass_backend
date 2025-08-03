import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authenticateToken from "./authenticateToken.js";
import authRouter from "./routes/auth.js";

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

app.get("/", (request, response) => {
  response.send("Hello, world");
});

// app.post("/register", async (request, response) => {

// });

// app.post("/login", async (request, response) => {});

// app.post("/logout", (request, response) => {

// });

app.get("/me", authenticateToken, (request, response) => {
  response.json({ user: request.user });
});

app.listen(3000);
