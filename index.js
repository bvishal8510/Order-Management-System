const express = require('express');
const app = express();
const db = require('./database');
const checkConfigVariables = require('./checkConfig');
const allRouter = require('./Routes/allRoutes');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const port = 8000;

db();                                           // checking database connection
// checkConfigVariables();                         // checking environment variables

var corsOptions = {
    credentials: true,
    origin: true
    // httponlycookie
    // logging
    // helmet
    // port from env
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());                                // handling cookies in request
app.use(cors(corsOptions));                             // handling cors

app.use('', allRouter);

//starting server
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`Running on port ${port}`);
});