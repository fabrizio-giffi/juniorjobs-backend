const router = require("express").Router();
const Company = require("../models/Company.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");
const JobPost = require("../models/JobPost.model");

router.get("/", async (req, res) => {
  try {
    const companyList = await Company.find();
    res.status(200).json(companyList);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const currentCompany = await Company.findById(req.params.id)
      .populate("jobPosts favorites")
      .populate({
        path: "jobPosts",
        populate: {
          path: "company",
          model: "Company",
        },
      });
    res.status(200).json(currentCompany);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const changes = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        address: {
          street: req.body.street,
          zipCode: req.body.zipCode,
          city: req.body.city,
          country: req.body.country,
        },
      },
    };
    const currentCompany = await Company.findByIdAndUpdate(
      req.params.id,
      changes,
      { new: true }
    );
    res
      .status(200)
      .json({ currentCompany, message: "Succesfully edited the information" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.put("/edit/picture/:id", async (req, res) => {
  try {
    const picture = {
      $set: {
        profilePic: req.body.profilePicture,
      },
    };
    const currentCompany = await Company.findByIdAndUpdate(
      req.params.id,
      picture,
      { new: true }
    );
    res.status(200).json(currentCompany);
  } catch (error) {
    console.log("There was an error uploading a profile picture", error);
  }
});

router.put("/addFavoriteJunior", async (req, res) => {
  const { id, juniorId } = req.body;
  try {
    const findJunior = await User.findById(juniorId);
    const currentCompany = await Company.findByIdAndUpdate(
      id,
      { $push: { favorites: findJunior._id } },
      { new: true }
    );
    res.status(200).json(currentCompany);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.put("/delete/favorite", async (req, res) => {
  const { id, favoriteId } = req.body;
  try {
    const deleteFavorite = await Company.findByIdAndUpdate(
      id,
      { $pull: { favorites: { $eq: favoriteId } } },
      { new: true }
    );
    res.status(200).json(deleteFavorite);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
