const router = require("express").Router();
const User = require("../models/User.model");
const JobPost = require("../models/JobPost.model");

router.get("/", async (req, res) => {
  try {
    const usersList = await User.find();
    res.status(200).json(usersList);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id)
      .populate("favoriteCompanies favoriteJobPosts")
      .populate({
        path: "favoriteJobPosts",
        populate: {
          path: "company",
          model: "Company",
        },
      });
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/edit/:id", async (req, res) => {
  const changes = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    location: {
      country: req.body.country,
      city: req.body.city,
    },
    calendly: req.body.calendly,
    bio: req.body.bio,
    pronouns: req.body.pronouns,
    field: req.body.field,
  };
  try {
    const currentUser = await User.findByIdAndUpdate(req.params.id, changes, {
      new: true,
    });
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/publicprofile/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const responseUser = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      location: currentUser.location,
      profilePic: currentUser.profilePic,
      skills: currentUser.skills,
      calendly:
        typeof currentUser.calendly !== "undefined" ? currentUser.calendly : "",
    };
    res.status(200).json(responseUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/edit/picture/:id", async (req, res) => {
  try {
    const picture = {
      $set: {
        profilePic: req.body.profilePicture,
      },
    };
    const currentUser = await User.findByIdAndUpdate(req.params.id, picture, {
      new: true,
    });
    res.status(200).json(currentUser);
  } catch (error) {
    console.log("There was an error uploading a profile picture", error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/privateprofile/deleteFavJobPost", async (req, res) => {
  const { id, postId } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      id,
      { $pull: { favoriteJobPosts: { $eq: postId } } },
      { new: true }
    );
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/privateprofile/deleteSkill", async (req, res) => {
  const { id, skill } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      id,
      { $pull: { skills: { $eq: skill } } },
      { new: true }
    );
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/privateprofile/deleteFavCompany", async (req, res) => {
  const { id, companyId } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      id,
      { $pull: { favoriteCompanies: { $eq: companyId } } },
      { new: true }
    );
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/addJobPost", async (req, res) => {
  const { id, postId } = req.body;
  try {
    const findJobPost = await JobPost.findById(postId);
    const currentUser = await User.findByIdAndUpdate(
      id,
      { $push: { favoriteJobPosts: findJobPost._id } },
      { new: true }
    );
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/addCompany", async (req, res) => {
  const { id, companyId } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      id,
      { $push: { favoriteCompanies: companyId } },
      { new: true }
    );
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/addNewSkill", async (req, res) => {
  const { id, newSkill } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(
      id,
      { $push: { skills: newSkill } },
      { new: true }
    );
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
