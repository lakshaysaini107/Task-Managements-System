import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import { ROLES, VALID_ROLES } from "../utils/roles.js";

const createToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const requestedRole = role?.toUpperCase();
    if (requestedRole && !VALID_ROLES.includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const userCount = await prisma.user.count();
    const assignedRole = userCount === 0 ? ROLES.ADMIN : requestedRole || ROLES.MEMBER;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
      },
    });

    const token = createToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};
