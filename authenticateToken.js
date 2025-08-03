import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateToken = (request, response, next) => {
  const token = request.cookies?.token;

  if (!token) {
    return response.status(401).send("No token so GET OU-");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  request.user = decoded;
  next();
};

export default authenticateToken;
