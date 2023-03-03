const router = require('express').Router();
const User = require('../models/User.model');

router.get('/', async (req, res) => {
    try {
      const usersList = await User.find();
      // console.log(usersList)
      res.json(usersList);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: err.message });
    }
  });

router.get('/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id).populate("favoriteCompanies favoriteJobPosts")
    // console.log(currentUser)
    res.json(currentUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.put('/edit/:id', async (req, res) => {
  try {
    const changes = req.body;
    delete changes.passwordHash;
    const currentUser = await User.findByIdAndUpdate(req.params.id, changes, {
      new: true,
    });
    // console.log(currentUser)
    res.json(currentUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

router.get('/publicprofile/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const responseUser ={
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      location: currentUser.location,
      profilePic: currentUser.profilePic,
      skills: currentUser.skills
    }
    res.json(responseUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
