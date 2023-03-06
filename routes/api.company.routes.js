const router = require("express").Router();
const Company = require("../models/Company.model");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

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
        path: "favorites",
        populate: {
          path: "user",
          model: "User",
        },
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
  console.log("BEFORE", req.body)
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
    console.log("AFTER", req.body)
    res.status(200).json(currentCompany)
  } catch (error) {
    console.log("There was an error uploading a profile picture", error)
  }
})

// router.get('/publicprofile/:id', async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.id);
//     const responseUser ={
//       firstName: currentUser.firstName,
//       lastName: currentUser.lastName,
//       location: currentUser.location,
//       profilePic: currentUser.profilePic,
//       skills: currentUser.skills
//     }
//     res.json(responseUser);
//   } catch (err) {
//     console.log(err);
//     res.status(404).json({ message: err.message });
//   }
// });

module.exports = router;
