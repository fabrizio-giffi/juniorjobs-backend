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

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const authUserRoutes = require("./routes/auth.user.routes");
app.use("/auth/user", authUserRoutes);

const authCompanyRoutes = require("./routes/auth.company.routes");
app.use("/auth/company", authCompanyRoutes);

// Api routes
const apiUserRoutes = require("./routes/api.user.routes");
app.use("/api/user", apiUserRoutes);

const apiCompanyRoutes = require("./routes/api.company.routes");
app.use("/api/company", apiCompanyRoutes);

const apiJobPostsRoutes = require("./routes/api.jobPosts.routes");
app.use("/api/posts", apiJobPostsRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
