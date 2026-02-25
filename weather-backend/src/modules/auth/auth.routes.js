import express from "express";
import { register, login } from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});

export default router;