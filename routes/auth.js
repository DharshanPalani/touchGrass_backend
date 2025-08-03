import express from "express";
import pool from "../db.js";
import jwt from "jsonwebtoken";
import authenticateToken from "../authenticateToken.js";

const authRouter = express.Router();

authRouter.post("/register", async (request, response) => {
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

authRouter.post("/login", async (request, response) => {
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

authRouter.post("/logout", async (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  response.sendStatus(200);
});

authRouter.get("/me", authenticateToken, async (request, response) => {
  response.json({ user: request.user });
});

export default authRouter;
