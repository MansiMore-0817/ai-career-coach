import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const signup = async (req, res) => {
  try {
    const { name, email, password, registerAs } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (registerAs && !["student", "mentor"].includes(registerAs)) {
      return res.status(400).json({ message: "Invalid registerAs value" });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Decide role & mentorStatus
    let role = "student";
    let mentorStatus = "none";

    if (registerAs === "mentor") {
      mentorStatus = "pending";
    }

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mentorStatus
    });

    // 6. Response
    res.status(201).json({
      message:
        registerAs === "mentor"
          ? "Mentor application submitted. Await admin approval."
          : "User registered successfully",
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};





export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Respond
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};