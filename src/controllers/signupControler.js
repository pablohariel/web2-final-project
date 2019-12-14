const mongoose = require('mongoose');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

var transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: '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'
    }
}));

exports.GetSignup = (req, res) => {
    res.render('signup', {
        pageTitle: 'Cadastro',
        loggedIn: req.session.isLoggedIn,
        user: req.session.user
    });
};

exports.PostSignup = (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    if (req.body.password == req.body.confirmPassword) {
        user.save()
        .then(result => {
              console.log('Usuario cadastrado!');
              transporter.sendMail({
                to: req.body.email,
                from: 'mateushedlundp@gmail.com',
                subject: 'Bem vindo ao Filmistico',
                text: `Olá ${req.body.username}, bem vindo ao Filmistico, uma rede social para descobrir e catalogar filmes!`,
                html: `<h1>Oi ${req.body.username},</h1><br><p>bem vindo ao <strong>Filmistico</strong>, uma rede social para descobrir e catalogar filmes!</p>`
            })
              res.redirect('/login');
        })
        .catch(error => {
              console.log(error);
              res.redirect('/signup');
        });
    } else {
        console.log('Senhas não batem');
        res.redirect('/signup');
    }
};
