const helpers = {};

helpers.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash("error", "Not authorized.");
    res.redirect("/users/signin");
};

module.exports = helpers;