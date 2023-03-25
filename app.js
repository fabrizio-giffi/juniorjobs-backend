// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const { isAuthenticated } = require("./middlewares/auth.middlewares");

const app = express();

require("./config")(app);

// Setting ejs as the view engine to use nodemailer
app.set('view engine', 'ejs');

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const checkoutRoutes = require("./routes/checkout.routes");
app.use("/checkout", checkoutRoutes);

const authUserRoutes = require("./routes/auth.user.routes");
app.use("/auth/user", authUserRoutes);

const authCompanyRoutes = require("./routes/auth.company.routes");
app.use("/auth/company", authCompanyRoutes);

const apiUserRoutes = require("./routes/api.user.routes");
app.use("/api/user", apiUserRoutes);

const apiCompanyRoutes = require("./routes/api.company.routes");
app.use("/api/company", apiCompanyRoutes);

const apiJobPostsRoutes = require("./routes/api.jobPosts.routes");
app.use("/api/posts", apiJobPostsRoutes);

require("./error-handling")(app);

module.exports = app;
