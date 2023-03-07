const router = require("express").Router();
const Company = require("../models/Company.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");

router.get("/", async (req, res) => {
  try {
    const companyList = await Company.find();
    res.json(companyList);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
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
        // path: "favorites",
        // populate: {
        //   path: "favorites",
        //   model: "User",
        // },
      });
    res.json(currentCompany);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
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
        }
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
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.put("/edit/picture/:id", async (req, res) => {
  try {
    const picture = {
     $set: {
      profilePic: req.body.profilePicture
     } 
    }
    const currentCompany = await Company.findByIdAndUpdate(
      req.params.id,
      picture,
      { new: true }
    );
    res.status(200).json(currentCompany)
  } catch (error) {
    console.log("There was an error uploading a profile picture", error)
  }
})

router.put("/addFavoriteJunior", async (req, res) => {
  const { id , juniorId } = req.body;
  const findJunior = await User.findById(juniorId);
  const currentCompany = await Company.findByIdAndUpdate(
    id,
     { $push: { favorites: findJunior._id} }, {new : true} 
     )
  res.status(200).json(currentCompany);
})

router.put("/delete/favorite", async (req, res) => {
  const { id , favoriteId } = req.body;
  const deleteFavorite = await Company.findByIdAndUpdate(id, { $pull: { favorites: { $eq: favoriteId } } }, {new : true} )
  res.status(200).json(deleteFavorite);
})

router.put("/delete/jobpost", async (req, res) => {
  const { id , jobPostId } = req.body;
  const deleteJobPost = await Company.findByIdAndUpdate(id, { $pull: { jobPosts: { $eq: jobPostId } } }, {new : true} )
  console.log(deleteJobPost)
  res.status(200).json(deleteJobPost);
})


module.exports = router;
