import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};
