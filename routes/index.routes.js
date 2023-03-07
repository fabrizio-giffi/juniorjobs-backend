const { isAuthenticated } = require("../middlewares/auth.middlewares");

const router = require("express").Router();

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
