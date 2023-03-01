const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
      street: String,
      zipCode: String,
      city: String,
      country: String,
    },
    profilePic: String,
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    jobPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobPost",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = model("Company", companySchema);

module.exports = Company;
