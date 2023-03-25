const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Company = require("../models/Company.model");
const jwt = require("jsonwebtoken");
const emailValidator = require("node-email-validation");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (name === "" || email === "" || password === "") {
    res.status(400).json({ message: "Provide valid informations." });
    return;
  }

  const isValid = emailValidator.is_email_valid(email);
  if (!isValid) {
    res.status(400).json({ message: "Provide a valid email." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
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
      const payload = {
        id: matchedCompany._id,
        name: matchedCompany.name,
        email: matchedCompany.email,
        role: "company",
      };
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

// PASSWORD RESET ROUTES + FUNCTIONS

const generateResetToken = async (email) => {
  const company = await Company.findOne({ email });
  if (!company) {
    res.status(500).json({message: "company not found"})
  }

  const resetToken = company._id;

  company.resetToken = company._id;
  company.resetTokenExpiry = Date.now() + 900000; // 15min
  await company.save();
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

  const resetUrl = `http://localhost:5173/reset/company/${resetToken}`;
  const message = {
    from: "",
    to: email,
    subject: "Password reset request",
    html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
  };
  await transporter.sendMail(message);
};

const verifyResetToken = async (token) => {
  const company = await Company.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!company) {
    throw new Error("Invalid or expired reset token");
  }

  return company;
};

const updatePassword = async (companyId, password) => {
  const company = await Company.findById(companyId);
  const salt = bcrypt.genSaltSync(12);

  if (!company) {
    throw new Error("company not found");
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  company.passwordHash = bcrypt.hashSync(password, salt);
  company.resetToken = null;
  company.resetTokenExpiry = null;

  try {
    await company.save();
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
    res.status(500).json({ message: "company not found" });
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
    const companyId = token;
    const company = await verifyResetToken(token);
    await updatePassword(companyId, password);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
