const router = require("express").Router();
const nodemailer = require("nodemailer");
const templates = require("../template/template");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");

router.get("/", (req, res) => {
  res.status(200).json({ message: "JuniorJobs deployment succesful" });
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

router.post("/send-email", async (req, res) => {
  const userFromId = await User.findById(req.body.id)
  const email = userFromId.email
  let { subject, message, contactInfo } = req.body;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.APP_PWD}`, // link: https://support.google.com/accounts/answer/185833?hl=en
    },
  });

  await transporter
    .sendMail({
      from: "Junior Jobs", // who is sending the email (if different from email in line 23 - not really sure about this)
      to: `${email}`, // who receives the email
      subject: subject, // subject of the email
      text: message, // text of the email
      html: templates.templateExample(message, contactInfo), // html template to send with email
    })
    .then((info) => {
      console.log(info);
      res.status(200).json({ email, subject, message, info });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
