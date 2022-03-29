const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
// mongoDB connection
const connectDB = require("./db/connect");
// this is used to keep the variables a secret while pushing on github
// dotenv is the package
require("dotenv").config();
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware

app.use(express.static("./public"));
app.use(express.json());

// routes
app.use("/api/v1/tasks", tasks);

// setting up for error 404
app.use(notFound);
// setup for error handler middleware
app.use(errorHandlerMiddleware);

// port setup
const port = process.env.PORT || 3000;

// starting the server and connecting to the DB
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
