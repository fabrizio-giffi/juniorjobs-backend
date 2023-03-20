const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
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
    address: {
      street: {
        type: String,
        default: "N/A",
      },

      zipCode: {
        type: String,
        default: "N/A",
      },

      city: {
        type: String,
        default: "N/A",
      },

      country: {
        type: String,
        default: "N/A",
      },
    },
    profilePic: String,
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        contacted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    jobPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobPost",
      },
    ],
    resetToken: {
      type: String,
      default: "",
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Company = model("Company", companySchema);

module.exports = Company;
