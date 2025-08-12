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
    var canEdit = false;
    const profileData = await pool.query(
      `
      SELECT * FROM profiles WHERE id = $1`,
      [userProfileExist.rows[0].id]
    );
    if (userProfileExist.rows[0].username === user.username) {
      canEdit = true;
    }

    const userData = {
      username: userProfileExist.rows[0].username,
      bio: profileData.rows[0].bio,
      canEdit: canEdit,
    };

    response.status(201).json(userData);
  } else {
    response.send("No person like that exist! Touch some grass GET OU-");
  }
});

userRouter.post(
  "/profile/update",
  authenticateToken,
  async (request, response) => {
    const user = request.user;
    const { firstName, lastName, age, course, interested, relationship, bio } =
      request.body;

    try {
      const query = `
        UPDATE profiles
        SET first_name = $1,
        last_name = $2,
        age = $3,
        course = $4,
        interested_in = $5,
        relationship_status = $6,
        bio = $7
        WHERE id = $8
        `;

      const values = [
        firstName,
        lastName,
        age,
        course,
        interested,
        relationship,
        bio,
        user.id,
      ];

      const result = await pool.query(query, values);
      response.status(201).send(result);
    } catch (error) {
      response.status(404).send("Error dawwawdihabgfuh");
    }
  }
);

export default userRouter;
