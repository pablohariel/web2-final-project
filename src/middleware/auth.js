exports.isLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect('/');
    }
};
  
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.session.loggedIn) {
      next();
    } else {
      res.redirect('/');
    }
};
  
exports.havePermission = (req, res, next) => {
    if (req.session.user._id == req.params.id || req.session.user.isadmin) {
        next();
    } else {
        res.send('Nao tem permissao');
    }
}