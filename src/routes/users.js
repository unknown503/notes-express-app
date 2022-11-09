const router = require("express").Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const { isAuth } = require("../helpers/auth");
const passport = require("passport");

router.get("/users/signin", ({ res }) => {
    res.render("users/signin");
});

router.post("/users/signin", passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
}));

router.get("/users/signup", ({ res }) => {
    res.render("users/signup");
});

router.post("/users/signup",
    body('email', 'Invalid email').isEmail().custom(async (email) => {
        const existingEmail = await User.findOne({ email: email }).exec();
        if (existingEmail) throw new Error();
        return true;
    }).withMessage("Email already in use."),
    body('name').isLength({ min: 2 }).withMessage("Invalid name."),
    body('password').isLength({ min: 5 }).withMessage("Passwords must be at least 5 characters.").custom((password, { req }) => {
        if (password !== req.body.repassword) throw new Error();
        return true;
    }).withMessage("Passwords must be identical."), async (req, res) => {
        const errors = validationResult(req);
        const { name, email, password } = req.body;
        if (!errors.isEmpty()) {
            res.render("users/signup", { errors_msg: errors.errors, name, email });
        } else {
            const NewUser = new User({ name, email, password })
            NewUser.password = await NewUser.encriptPassword(password);
            await NewUser.save();
            req.flash("success_msg", "Account created successfully.");
            res.redirect("/users/signin");
        }
    });

router.get("/users/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

router.get("/users/settings", isAuth, async (req, res) => {
    await User.findById(req.user._id).lean().exec((err, user) => {
        res.render("users/settings", { user });
    });
});

router.post("/users/settings", isAuth,
    body('email', 'Invalid email').isEmail(),
    body('name').isLength({ min: 2 }, "len").withMessage("Invalid name."),
    body("password").custom(password => {
        const length = password.length,
            isEmpty = length > 0,
            minLength = length < 5;
        /**
         * Will password be changed?
         * @param {boolean} isEmpty - Is the field empty or not.
         * @param {boolean} minLength - Minimum characters for password.
         * @return {error} Returns an error if isEmpty and minLength are true.
         */
        if (isEmpty && minLength) throw new Error();
        return true;
    }),
    body('cupassword').custom(async (cupassword, { req }) => {
        const user = await User.findById(req.user._id).exec();
        const match = await user.matchPassword(cupassword);
        if (!match) throw new Error();
        return true;
    }).withMessage("Current password is wrong."), async (req, res) => {
        const { name, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash("errors_msg", errors.errors);
            res.redirect("back");
        } else {
            const user = await User.findByIdAndUpdate(req.user._id, { name, email });
            if (password.length) {
                user.password = await user.encriptPassword(password);
                await user.save();
            }
            req.flash("success_msg", "Changes saved.");
            res.redirect("back");
        }
    });

module.exports = router;