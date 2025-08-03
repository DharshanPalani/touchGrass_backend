import express from "express";
import pool from "../../db.js";

const userRouter = express.Router();

userRouter.get("/:username", async (request, response) => {
  const { username } = request.params;

  const userProfileExist = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (userProfileExist.rows.length > 0) {
    response.send(
      (await userProfileExist).rows[0].username +
        " exists, this is their profile btw!"
    );
  } else {
    response.send("No person like that exist! Touch some grass GET OU-");
  }
});

export default userRouter;
