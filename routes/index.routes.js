const { isAuthenticated } = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({message: "JuniorJobs deployment succesful"});
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
