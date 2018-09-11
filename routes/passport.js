const passport = require("passport");
const localStratergy = require("passport-local").Strategy;


passport.serializeUser(function (user, done) {
    done(null, user.Id);
});


passport.deserializeUser(function (id, done) {
    con.query("select * from admin where Id = " + id, function (err, rows) {
        done(null, rows[0]);
    });
});

passport.use('local-login', new localStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    con.query("SELECT * FROM admin WHERE `Email` = '" + email + "'", function (err, rows) {
        if (err)
            return done(err);
        if (!rows.length) {
            return done(null, null, req.flash("loginMessage", 'No user found.'));
        }

        if (!(rows[0].Password == password))
            return done(null, null, req.flash("loginMessage", 'Oops! Wrong password.'));

        return done(null, rows[0]);

    });
}));