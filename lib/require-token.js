let requireToken = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = requireToken;
