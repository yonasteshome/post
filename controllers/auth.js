import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      location, occupation
    } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      picturePath: req.file?.filename || "",
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000)
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d"
    });

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ token, user: userWithoutPassword });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email, redirectUrl } = req.body;

    if (!redirectUrl) {
      return res.status(400).json({ message: "Missing redirect URL." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_RESET,
      { expiresIn: "15m" }
    );

    const resetLink = `${redirectUrl}/reset-password/${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `
        <p>Hello ${user.firstName || "user"},</p>
        <p>You requested a password reset. Click the link below:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link is valid for 15 minutes. If you didn't request this, ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Reset link sent to your email." });

  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET_RESET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

