// Importing required modules
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

/**
 * AUTH MIDDLEWARE
 * - Token read karega: cookie / body / Authorization header
 * - JWT verify karega
 * - req.user me decoded data set karega
 */
exports.auth = async (req, res, next) => {
  try {
    // 🔑 Get token from cookie, body or header
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};

/**
 * STUDENT ROLE CHECK
 */
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (!userDetails || userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This route is protected for Students only",
      });
    }

    next();
  } catch (error) {
    console.error("STUDENT ROLE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    });
  }
};

/**
 * INSTRUCTOR ROLE CHECK
 */
exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (!userDetails || userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This route is protected for Instructors only",
      });
    }

    next();
  } catch (error) {
    console.error("INSTRUCTOR ROLE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    });
  }
};

/**
 * ADMIN ROLE CHECK
 */
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (!userDetails || userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This route is protected for Admins only",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN ROLE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    });
  }
};
