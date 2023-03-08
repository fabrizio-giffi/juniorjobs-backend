const router = require("express").Router();
const JobPost = require("../models/JobPost.model");
const Company = require("../models/Company.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { isJobPoster } = require("../middlewares/jobPost.middlewares");

router.get("/", async (req, res) => {
  try {
    const JobPostList = await JobPost.find().populate("company");
    res.status(200).json(JobPostList);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const currentJobPost = await JobPost.findById(req.params.id).populate(
      "company"
    );
    res.json(currentJobPost);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { title, description, email, salaryRange, address, company, stack } =
    req.body;
  const editJobBody = {
    title,
    description,
    email,
    salaryRange,
    address,
    company,
    stack,
  };
  try {
    const editJobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      editJobBody,
      { new: true }
    );
    res.json(editJobPost);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, email, salaryRange, address, company, stack } =
    req.body;
  const newJobBody = {
    title,
    description,
    email,
    salaryRange,
    address,
    company,
    stack,
  };
  try {
    const newJobPost = await JobPost.create(newJobBody);
    await Company.findByIdAndUpdate(
      company,
      { $push: { jobPosts: newJobPost._id } },
      { new: true }
    );
    res.status(201).json({ id: newJobPost._id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.put("/edit/:id", isAuthenticated, isJobPoster, async (req, res) => {
  try {
    const changes = req.body;
    delete changes.passwordHash;
    const currentJobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      changes,
      { new: true }
    );
    res.json(currentJobPost);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteJobPost = await JobPost.findByIdAndDelete(id);
    res.status(200).json(deleteJobPost);
  } catch (error) {
    console.log(error);
    res.status(404).json({message: error})
  }
});

module.exports = router;
