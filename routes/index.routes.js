const router = require("express").Router();
const nodemailer = require("nodemailer");
const templates = require("../template/template");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

router.get("/", (req, res) => {
  res.status(200).json({ message: "JuniorJobs deployment succesful" });
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

router.post("/send-email", async (req, res, next) => {
  let { email, subject, message } = req.body;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "<your gmail password here>",
      pass: "<your application password here>", // link: https://support.google.com/accounts/answer/185833?hl=en
    },
  });

  await transporter
    .sendMail({
      from: "", // who is sending the email (if different from email in line 23 - not really sure about this)
      to: `${email}`, // who receives the email
      subject: subject, // subject of the email
      text: message, // text of the email
      html: templates.templateExample(message), // html template to send with email
    })
    .then((info) => {
      console.log(info);
      res.render("message", { email, subject, message, info });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
