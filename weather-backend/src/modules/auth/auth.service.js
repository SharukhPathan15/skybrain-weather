import bcrypt from "bcrypt";
import { User } from "../users/user.model.js";
import { generateToken } from "../../utils/jwt.utils.js";

export const registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken({ userId: user._id });

  return { user, token };
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ userId: user._id });

  return { user, token };
};