const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const Company = require('../models/Company.model')
const jwt = require("jsonwebtoken");
const emailValidator = require("node-email-validation");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide valid email and password" });
    return;
  }

  const isValid = emailValidator.is_email_valid(email);

  if (!isValid) {
    res.status(400).json({ message: "Provide a valid email." });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
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
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// PASSWORD RESET ROUTES + FUNCTIONS

const generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    res.status(500).json({message: "User not found"})
  }

  const resetToken = user._id;

  user.resetToken = user._id;
  user.resetTokenExpiry = Date.now() + 900000; // 15min
  await user.save();
  return resetToken;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.APP_PWD}`, // link: https://support.google.com/accounts/answer/185833?hl=en
    },
  });

  const resetUrl = `http://localhost:5173/reset/user/${resetToken}`;
  const message = {
    from: "",
    to: email,
    subject: "Password reset request",
    html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
  };
  await transporter.sendMail(message);
};

const verifyResetToken = async (token) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  return user;
};

const updatePassword = async (userId, password) => {
  const user = await User.findById(userId);
  const salt = bcrypt.genSaltSync(12);

  if (!user) {
    throw new Error("User not found");
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  user.passwordHash = bcrypt.hashSync(password, salt);
  user.resetToken = null;
  user.resetTokenExpiry = null;

  try {
    await user.save();
    console.log("Password updated successfully");
  } catch (err) {
    console.error(err);
    throw new Error("Error updating password");
  }

};

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const resetToken = await generateResetToken(email);
    await sendPasswordResetEmail(email, resetToken);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User not found" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }
  
  try {
    const userId = token;
    const user = await verifyResetToken(token);
    await updatePassword(userId, password);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
