const UserModel = require('../models/user');

exports.Login = async (req, res) => {
    
    await UserModel.find().select('').where('email').equals(req.body.email).then(user => {

        console.log(user);

        if(user.length > 0) {

            if(user[0].password == req.body.password) {
                
                let message = 'Logged in successfully!';
                res.statusCode = 200;
                res.send(message);
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