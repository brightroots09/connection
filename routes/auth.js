
exports.isAuthenticated = isAuthenticated;


function isAuthenticated (req, res, callback) {
    if (req.isAuthenticated()) {
        return callback()
    }
    res.redirect("/login")
}