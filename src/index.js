const express = require("express")
const path = require("path");
const hb = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//Init
const app = express();
require("./database");
require("./config/passport");

//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", hb({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
        year: () => new Date().getFullYear(),
        readableDate: (date) => `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
}));
app.set("view engine", ".hbs");

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
    secret: process.env.SECRET || "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000, _expires: 60000000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.errors_msg = req.flash("errors_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

//Static
app.use(express.static(path.join(__dirname, "public")));

//Server
app.listen(app.get("port"));