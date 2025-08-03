import express from "express";
import cors from "cors";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authenticateToken from "./authenticateToken.js";

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

app.post("/register", async (request, response) => {
  const { username, password } = request.body;

  try {
    const userExist = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExist.rows.length > 0) {
      return response.status(400).send("Username already exists");
    } else {
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, password]
      );

      response.status(201).send("Register successful");
    }
  } catch (error) {
    console.log("Error at registration: " + error);
    response.status(500).send("Error at registration");
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  const userExist = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (userExist.rows.length > 0) {
    if (password === userExist.rows[0].password) {
      const token = jwt.sign(
        { id: userExist.rows[0].id, username: userExist.rows[0].username },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      response.cookie("token", token, { httpOnly: true, secure: false });

      return response.status(201).send("Login successful");
    } else {
      return response.send("Wrong password daw");
    }
  } else {
    return response.status(400).send("Invalid username or password");
  }
});

app.post("/logout", (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  response.sendStatus(200);
});

app.get("/me", authenticateToken, (request, response) => {
  response.json({ user: request.user });
});

app.listen(3000);
