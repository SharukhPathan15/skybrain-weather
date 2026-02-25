import { verifyToken } from "../utils/jwt.utils.js";
import { User } from "../modules/users/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error("Not authorized. No token provided.");
      error.statusCode = 401;
      throw error;
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      const error = new Error("User no longer exists.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user; 

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};