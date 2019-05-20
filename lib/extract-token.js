
let extractToken = (req, res, next) => {

  req.token = req.session.passport.user.accessToken;
  next();
};

module.exports = extractToken;
