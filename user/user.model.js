import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian mobile number",
      ],
      set: function (value) {
        return value.replace(/\D/g, "");
      },
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["viewer", "reviewer", "admin"],
      default: "viewer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    preferences: {
      darkMode: { type: Boolean, default: false },
    },

    loginHandler: {
      lastLogin: {
        type: Date,
        default: null,
      },
      lastLoginDeviceIp: {
        type: String,
        default: null,
      },
      lastLoginToken: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    this.password = await argon2.hash(this.password);
  } catch (err) {
    throw new Error("Password hashing failed");
  }
});

const User = mongoose.model("User", userSchema);
export default User;
