const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    await User.findOne({ email: email }, async (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: "Incorrect data." });
        } else {
            const match = await user.matchPassword(password);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect data." });
            }
        }
    });
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, { _id: user._id, name: user.name, email: user.email });
    });
});