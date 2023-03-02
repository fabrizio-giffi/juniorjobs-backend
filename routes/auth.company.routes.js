const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Company = require("../models/Company.model");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (name === "" || email === "" || password === "") {
    res.status(400).json({ message: "Provide valid informations." });
    return;
  }

  try {
    const query = { $or: [{ name: name }, { email: email }] };
    const matchCompany = await Company.findOne(query);
    if (matchCompany) {
      return res.status(400).json({ message: "Company name or email already in use." });
    }
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newCompany = await Company.create({ name, email, passwordHash });
    const response = { name: newCompany.name, email: newCompany.email, id: newCompany._id };
    res.status(201).json(response);
  } catch (error) {
    console.log("There was an error with the signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  if (name === "" || password === "") {
    res.status(400).json({ message: "Provide valid name and password." });
    return;
  }
  try {
    const matchedCompany = await Company.findOne({ name });
    if (!matchedCompany) {
      res.status(401).json({ message: "Company not found." });
      return;
    }
    if (bcrypt.compareSync(password, matchedCompany.passwordHash)) {
      const payload = { id: matchedCompany._id, name: matchedCompany.name, email: matchedCompany.email, role: "company" };
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

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
