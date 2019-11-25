const UserModel = require('../models/user');

exports.Update = async (req, res) => {

    let user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    await UserModel.findByIdAndUpdate(req.params.id, user).then(result => {
        
        if(result === null) {

            let message = 'Something going wrong, try again!';
            res.statusCode = 400;
            res.send(message);

        } else {

            let message = 'Updated successfully!';
            res.statusCode = 200;
            res.send(message);

        }
    }).catch(err => {

        let message = 'Something going wrong, try again!';
        res.statusCode = 400;
        res.send(message);

    });
    
}

exports.Delete = async (req, res) => {

    await UserModel.findByIdAndRemove(req.params.id).then(result => {

        if(result === null) {

            let message = 'Something going wrong, try again!';
            res.statusCode = 400;
            res.send(message);

        } else {

            let message = 'Delete successfully!';
            res.statusCode = 200;
            res.send(message);

        }
    }).catch(err => {

        let message = 'Something going wrong, try again!';
        res.statusCode = 400;
        res.send(message);

    });

}