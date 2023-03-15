const { Schema, model } = require("mongoose");

const jobPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      jobtype: {
        type: String,
        enum: ["full time", "part time", "freelance"],
      },
      heading: String,
      tasks: String,
      requirements: String,
      benefits: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    salaryRange: {
      minimum: Number,
      maximum: Number,
    },
    address: {
      city: String,
      country: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    stack: [String],
    field: {
      type: String,
      enum: ["Frontend", "Backend", "Full-stack", "UX/UI", "Cyber security", "Data analytics"],
    },
  },
  {
    timestamps: true,
  }
);

const JobPost = model("JobPost", jobPostSchema);

module.exports = JobPost;
