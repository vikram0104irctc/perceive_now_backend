import logger from "../../logger/logger.js";
import User from "../user.model.js";
import validator from "validator";

// Validation constants
const MIN_PASSWORD_LENGTH = 8;
const VALID_ROLES = ["reviewer", "admin", "reviewer"]; // Adjust based on your needs
const MOBILE_REGEX = /^[0-9]{10}$/; // Basic 10-digit mobile validation
const ADMIN_ROLE = "admin";

export const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    role = "viewer",
    mobile,
    password,
  } = req.body;

  if (!firstName) {
    return res.status(400).json({
      success: false,
      message: "First Name is required",
      field: "name",
    });
  }

  if (typeof firstName !== "string") {
    return res.status(400).json({
      success: false,
      message: "Name must be a string",
      field: "name",
    });
  }

  if (firstName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must be at least 2 characters long",
      field: "name",
    });
  }

  // Validate email
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
      field: "email",
    });
  }

  if (typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email must be a string",
      field: "email",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
      field: "email",
    });
  }

  // Validate mobile
  if (!mobile) {
    return res.status(400).json({
      success: false,
      message: "Mobile number is required",
      field: "mobile",
    });
  }

  if (typeof mobile !== "string") {
    return res.status(400).json({
      success: false,
      message: "Mobile number must be a string",
      field: "mobile",
    });
  }

  if (!MOBILE_REGEX.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid 10-digit mobile number",
      field: "mobile",
    });
  }

  // Validate password
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
      field: "password",
    });
  }

  if (typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Password must be a string",
      field: "password",
    });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      field: "password",
    });
  }

  // Validate role
  if (role && typeof role !== "string") {
    return res.status(400).json({
      success: false,
      message: "Role must be a string",
      field: "role",
    });
  }

  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Valid roles are: ${VALID_ROLES.join(", ")}`,
      field: "role",
    });
  }

  try {
    if (role === ADMIN_ROLE) {
      const existingAdmin = await User.findOne({ role: ADMIN_ROLE });

      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          message: "System already has an admin account",
          field: "role",
        });
      }

      // Additional security layer for admin creation
      const isAuthorizedToCreateAdmin =
        req.body?.adminCreationToken === process.env.ADMIN_CREATION_TOKEN;

      if (!isAuthorizedToCreateAdmin) {
        logger.warn(`Unauthorized admin creation attempt from IP: ${req.ip}`);
        return res.status(403).json({
          success: false,
          message: "Admin account creation requires special authorization",
        });
      }
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "mobile";
      return res.status(409).json({
        success: false,
        message: `User with this ${conflictField} already exists`,
        field: conflictField,
      });
    }

    const newUser = new User({
      firstName: validator.escape(firstName.trim()),
      lastName: lastName ? validator.escape(lastName.trim()) : null,
      email: validator.normalizeEmail(email),
      mobile,
      password,
      role,
    });

    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.firstName,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    logger.info(`New user registered: ${userResponse.email}`);

    return res.status(201).json({
      success: true,
      message: "User registration successful",
      data: userResponse,
    });
  } catch (error) {
    // Error handling remains the same as previous version
    logger.error("Error in signup:", error.message, { stack: error.stack });

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email or mobile already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
