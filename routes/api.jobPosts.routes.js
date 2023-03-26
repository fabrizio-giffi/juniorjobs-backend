const router = require("express").Router();
const JobPost = require("../models/JobPost.model");
const Company = require("../models/Company.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { isJobPoster } = require("../middlewares/jobPost.middlewares");

router.get("/", async (req, res) => {
  try {
    const JobPostList = await JobPost.find().populate("company");
    res.status(200).json(JobPostList);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const currentJobPost = await JobPost.findById(req.params.id).populate("company");
    res.status(200).json(currentJobPost);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { title, description, email, salaryRange, address, company, stack, field } = req.body;
  const editJobBody = {
    title,
    description,
    email,
    salaryRange,
    address,
    company,
    stack,
    field,
  };
  try {
    const editJobPost = await JobPost.findByIdAndUpdate(req.params.id, editJobBody, { new: true });
    res.status(200).json(editJobPost);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, email, salaryRange, address, company, stack, field } = req.body;
  const stackList = stack.split(",").map((stack) => stack.trim());
  const newJobBody = { title, description, email, salaryRange, address, company, stack: stackList, field };
  try {
    const newJobPost = await JobPost.create(newJobBody);
    await Company.findByIdAndUpdate(company, { $push: { jobPosts: newJobPost._id } }, { new: true });
    res.status(201).json({ id: newJobPost._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteJobPost = await JobPost.findByIdAndDelete(id);
    res.status(200).json(deleteJobPost);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
});

module.exports = router;
