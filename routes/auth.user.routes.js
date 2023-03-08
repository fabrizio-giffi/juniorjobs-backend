const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const emailValidator = require("node-email-validation");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide valid email and password" });
    return;
  }

  const isValid = emailValidator.is_email_valid(email);
  console.log(isValid);

  if (!isValid) {
    res.status(400).json({ message: "Provide a valid email." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    const matchUser = await User.findOne({ email });
    if (matchUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUser = await User.create({ email, passwordHash });
    const response = { email: newUser.email, id: newUser._id };
    res.status(201).json(response);
  } catch (error) {
    console.log("There was an error with the signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide valid email and password" });
    return;
  }
  try {
    const matchedUser = await User.findOne({ email });
    if (!matchedUser) {
      res.status(401).json({ message: "User not found." });
      return;
    }
    if (bcrypt.compareSync(password, matchedUser.passwordHash)) {
      const payload = {
        id: matchedUser._id,
        email: matchedUser.email,
        role: "junior",
      };
      // console.log(payload.favoriteJobPosts);
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: "HS256", expiresIn: "6h" });
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;
