const dotenv = require('dotenv');
const express = require("express");
const bodyParser = require("body-parser")
const session = require('express-session')

dotenv.config();
const app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'c0e3d8d9a7b191d4af7e0ab589808bdf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// Routers
app.use('/', require('./routes/generalRoutes'))
app.use('/error', require('./routes/errorRoutes'))
app.use('/user', require('./routes/authRoutes'))
app.use('/users', require('./routes/usersRoutes'))
app.use('/subs', require('./routes/subRoutes'))
app.use('/posts', require('./routes/postRoutes'))
app.use('/comment', require('./routes/commentRoutes'))

if (process.env.DEBUG === "TRUE") {
    function debug() {
        console.log("==== DB DEBUGING ====")

        console.log("users", require('./core/fakeDB/data/users'))
        console.log("posts", require('./core/fakeDB/data/posts'))
        console.log("comments", require('./core/fakeDB/data/comments'))
        console.log("votes", require('./core/fakeDB/data/votes'))
        console.log("==== DB DEBUGING ====")
    }
    debug()

    const PORT = process.env.PORT || 8000;

    console.log("---- DEVELOPMENT ----")

    app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))
} else {
    module.exports = app;
}