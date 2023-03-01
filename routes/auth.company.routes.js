const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

router.post("/signup", async (req, res) => {
})

router.post("/login", (req, res) => {
  res.json("All good in here");
});

router.post("/verify", (req, res) => {
  res.json("All good in here");
});

module.exports = router;
