const UserModel = require('../models/user');

exports.Signup = async (req, res) => {

    if(req.body.password !== req.body.confirm_password) {

        let message = 'Passwords dont match';
        res.send(message);

    } else {

        let user = new UserModel({email: req.body.email, username: req.body.username, password: req.body.password});
        await user.save((err, result) => {

            if(err) {

                let message = 'Email already used!';
                res.render('signup');

            } else {

                let message = 'Account created successfully!';
                res.redirect('/login');
                
            }
        });

    }
}

exports.Login = async (req, res) => {
    
    await UserModel.find().select('').where('email').equals(req.body.email).then(user => {

        if(user.length > 0) {

            if(user[0].password == req.body.password) {
                
                req.session.user = user[0];
                req.session.isLogged = true;
                res.statusCode = 200;

                if(user[0].isAdmin) {
                    req.session.isAdmin = true;
                    res.redirect('/home');
                } else {
                    res.redirect('/home');
                }

            } else {

                let message = 'Email and password dont match';
                res.statusCode = 400;
                res.send(message);
            }
        } else {

            let message = 'Account doesnt exist';
            res.statusCode = 400;
            res.send(message);
        }

    }).catch(err => {
        let message = 'Something going wrong, try again!';
        res.statusCode = 400;
        res.send(message);
    });

}

exports.Signout = async(req, res) => {

    if(req.session.isLogged) {
        req.session.destroy();
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
    
}

exports.Update = async (req, res) => {

    let user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }


    await UserModel.findByIdAndUpdate(req.params.id, user, {new : true}).then(result => {

        // console.log(result)
        if(result === null) {

            let message = 'Something going wrong, try again!';
            res.send(message);

        } else {

            req.session.user = result;
            let message = 'User ' + result.username + ' updated successfully!';
            console.log(message);
            res.redirect('/profile/' + result._id);

        }
    }).catch(err => {
        let message = 'Something going wrong, try again!';
        res.send(message);

    });
    
}

exports.Delete = async (req, res) => {

    if(req.session.isLogged) {

        if(req.params.id == req.session._id) {
            await UserModel.findByIdAndRemove(req.params.id).then(result => {

                if(result === null) {
        
                    let message = 'Something going wrong, try again!';
                    res.send(message);
        
                } else {
        
                    req.session.destroy();
                    let message = 'Delete successfully!';
                    res.redirect('/login');
        
                }
            }).catch(err => {
                let message = 'Something going wrong, try again!';
                res.send(message);
        
            });
        } else {
            const message = 'User doesnt have permission!';
            console.log(message);
            res.redirect('/home');
        }
    
    } else {
        const message = 'User not logged!';
        console.log(message);
        res.redirect('/login');
    }
    

    

}
