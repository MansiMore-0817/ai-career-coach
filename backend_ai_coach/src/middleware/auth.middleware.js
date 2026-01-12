// JWT verification middleware


import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request
    req.user = decoded; // { userId, role, iat, exp }

    next();

  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
