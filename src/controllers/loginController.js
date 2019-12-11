const mongoose = require('mongoose');
const User = require('../models/User');

exports.GetLogin = (req, res) => {
    res.render('login', {
        pageTitle: 'Login',
        loggedIn: req.session.isLoggedIn,
        user: req.session.user
    });
};

exports.Logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

exports.PostLogin = (req, res) => {
    User.find({ email: req.body.email, password: req.body.password })
      .then( result => {
          if (result.length > 0) {
              req.session.user = result[0];
              req.session.loggedIn = true;
              if (result[0].isadmin) {
                  req.session.isadmin = true;
                  res.redirect('/');
              } else {
                  res.redirect('/');
              }
          } else {
              res.render('login', {
                  pageTitle: 'Login',
                  loggedIn: req.session.loggedIn,
                  user: req.session.user,
                  erro: 'Dados não conferem'
              });
          }
        });
};
