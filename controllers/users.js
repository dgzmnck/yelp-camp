const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);

    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registered and loggedin");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogIn = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "you are logged in now");
  console.log("ON LOGIN:", req.session);
  console.log(res.locals.returnUrl);
  const redirectUrl = res.locals.returnUrl || "/campgrounds";
  delete res.locals.returnUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
  });
};
