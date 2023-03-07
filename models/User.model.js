const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      // required: true,
      trim: true,
    },
    lastName: {
      type: String,
      // required: true,
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
      country: String,
      city: String,
    },
    profilePic: String,
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
    calendly: String
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
