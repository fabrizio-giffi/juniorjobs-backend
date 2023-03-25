const router = require("express").Router();
const nodemailer = require("nodemailer");
const templates = require("../template/template");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");
const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API });

router.post("/", async (req, res) => {
  const { value, currency, description } = req.body;
  console.log(req.body);

  const payment = await mollieClient.payments.create({
    method: "creditcard",
    amount: {
      value: value,
      currency: currency,
    },
    description: description,
    redirectUrl: "https://juniorjobs-frontend.netlify.app/",
    webhookUrl: "https://juniorjobs-frontend.netlify.app/",
  });

  console.log(payment.getCheckoutUrl());

  res.status(200).json(payment);
});

router.post("/webhook", async (req, res) => {

});

module.exports = router;
