import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Create Admin (Internal Use Only)
export const createAdmin = async (req, res) => {
    const { a_name, email, a_phnno, password } = req.body;

    // Check if required fields are provided
    if (!a_name || !email || !a_phnno || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = "INSERT INTO Admin (a_name, email, a_phnno, password) VALUES (?, ?, ?, ?)";
    db.query(query, [a_name, email, a_phnno, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "Email or phone number already exists" });
            }
            return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "Admin created successfully" });
    });
};

// Admin Login
export const adminLogin = (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM Admin WHERE email = ?";
    db.query(query, [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!result.length) return res.status(400).json({ message: "Admin not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: result[0].admin_id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
        });

        // Send token in HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure only in production
            sameSite: "strict",
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ message: "Login successful" });
    });
};

// Admin Logout
export const adminLogout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
};
