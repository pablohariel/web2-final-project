const UserModel = require('../models/user');

exports.Render_login = async (req, res) => {

    if(req.session.isLogged) {
        res.redirect('/home')
    } else {
        res.render('login');
    }

}

exports.Render_signup = async (req, res) => {

    if(req.session.isLogged) {
        res.redirect('/home');
    } else {
        res.render('signup');
    }

}

exports.Render_home = async (req, res) => {

    if(req.session.isLogged) {
        res.render('home', {user : req.session.user});
    } else {
        res.redirect('/login');
    }

}

exports.Render_profile = async (req, res) => {

    if(req.session.isLogged) {
        UserModel.findById(req.params.id).then(result => {
            
            if(result === null) {
                
                let message = 'User not found!';
                console.log(message);
                res.redirect('/home');
    
            } else {
    
                res.render('profile', {user : req.session.user, user_searched : result });
    
            }
        }).catch(err => {

            console.log(err);
            res.redirect('/home');

        });
    } else {
        res.redirect('/login');
    }
    

}