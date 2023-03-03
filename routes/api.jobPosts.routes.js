const router = require("express").Router();
const JobPost = require("../models/JobPost.model");
const Company = require("../models/Company.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { isJobPoster } = require("../middlewares/jobPost.middlewares");

router.get("/", async (req, res) => {
  try {
    const JobPostList = await JobPost.find();
    res.json(JobPostList);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const currentJobPost = await JobPost.findById(req.params.id);
    // console.log(currentJobPost)
    res.json(currentJobPost);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, email, salaryRange, address, company, stack } = req.body;
  const newJobBody = { title, description, email, salaryRange, address, company, stack };
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
    const currentJobPost = await JobPost.findByIdAndUpdate(req.params.id, changes, { new: true });
    console.log(req.payload);
    res.json(currentJobPost);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
