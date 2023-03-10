const { isAuthenticated } = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({message: "JuniorJobs deployment succesful"});
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
const router = require("express").Router();
const nodemailer = require("nodemailer");
const templates = require("../template/template")

router.post("/send-email", async (req, res, next) => {
  let { email, subject, message } = req.body;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "fabrizio.giffi@gmail.com",
      pass: "gzogzepnsupqajhl",
    },
  });

  await transporter
    .sendMail({
      from: '',
      to: `${email}`,
      subject: subject,
      text: message,
      html: templates.templateExample(message),
    })
    .then((info) => {
      console.log(info);
      res.render("message", { email, subject, message, info });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
