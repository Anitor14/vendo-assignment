require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

//rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//database
const connectDB = require("./db/connect");

// routers

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));

app.use(fileUpload());

app.get("/", (req, res) => {
  // console.log(req.cookies);
  res.send("vendo assignments");
});

// initiating our middleware.
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.port || 3000; //define port.

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on ${port}`)); // listen on the server.
  } catch (error) {
    console.log(error);
  }
};

start();
