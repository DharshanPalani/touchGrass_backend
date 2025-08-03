import express from "express";
import pool from "../../db.js";
import authenticateToken from "../../authenticateToken.js";

const userRouter = express.Router();

userRouter.get("/:username", authenticateToken, async (request, response) => {
  const user = request.user;
  const { username } = request.params;

  const userProfileExist = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (userProfileExist.rows.length > 0) {
    if (userProfileExist.rows[0].username === user.username) {
      return response.send("Daw it's you! touch grass GET OU-");
    }
    // response.send(
    //   userProfileExist.rows[0].username + " exists, this is their profile btw!"
    // );

    const userData = {
      username: userProfileExist.rows[0].username,
    };

    response.json({ userData });
  } else {
    response.send("No person like that exist! Touch some grass GET OU-");
  }
});

export default userRouter;
