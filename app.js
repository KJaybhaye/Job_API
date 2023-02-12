const express = require("express");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/errorHandlers");
require('express-async-errors');
require("dotenv").config();
// const {router} = require("./routes/route_main.js")
const connectDB = require("./db/connect");

const jobRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const authUser = require("./middleware/auth");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");


const port = process.env.PORT || 5000;

const app = express();

// if we are behind a reverse proxy (heroku, aws etc), need for rate limit
// may need to increase its number 
app.set("trust proxy", 1)

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use( rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// app.use("/api/v1/tasks", task_v1);
app.get("/", (req, res) => {
    res.json({data: "hello"});
});


app.use("/jobs",authUser, jobRouter);
app.use("/auth", authRouter);


app.use(notFound);
app.use(errorHandler);



const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Listening at port ${port}`);
        });
    }
    catch(error){
        console.log(error);
    }
}

start();