const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "N/A",
      trim: true,
    },
    lastName: {
      type: String,
      default: "N/A",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
    location: {
      country: {
        type: String,
        default: "N/A",
      },

      city: {
        type: String,
        default: "N/A",
      },
    },
    profilePic: String,
    bio: {
      type: String,
      maxLength: 200,
      default: "Describe yourself",
    },
    pronouns: String,
    field: {
      type: String,
      enum: ["Frontend", "Backend", "Full-stack", "UX/UI", "Cyber security", "Data analytics"],
    },
    skills: [String],
    favoriteCompanies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
    favoriteJobPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobPost",
      },
    ],
    calendly: String,
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
