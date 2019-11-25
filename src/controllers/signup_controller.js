const UserModel = require('../models/user');

exports.Signup = async (req, res) => {

    if(req.body.password !== req.body.confirm_password) {

        let message = 'Passwords dont match';
        res.statusCode = 400;
        res.send(message);

    } else {

        let user = new UserModel({email: req.body.email, username: req.body.username, password: req.body.password});
        await user.save((err, result) => {

            if(err) {

                let message = 'Email already used!';
                res.statusCode = 400;
                res.send(message);

            } else {

                let message = 'Account created successfully!';
                res.statusCode = 200;
                res.send(message);
                
            }
        });

    }
}