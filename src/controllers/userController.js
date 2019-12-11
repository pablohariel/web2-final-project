const Movie = require('../models/Movie');
const User = require('../models/User');

exports.GetHome = async (req, res) => {
    await Movie.find().then(result => {
        res.render('home', {
            pageTitle: 'Filmistico',
            movies: result,
            loggedIn: req.session.isLoggedIn,
            user: req.session.user
        });
  });
};

exports.MovieDetails = async (req, res) => {
    await Movie.findById(req.params.id).then(result => {
        res.render('details', {
            pageTitle: result.title,
            movie: result,
            loggedIn: req.session.isLoggedIn,
            user: req.session.user
        });
  });
};

exports.UserDetails = async (req, res) => {
    await User.findById(req.params.id)
    .then(result => {
        if (result === null) {
            let message = 'User not found!';
            console.log(message);
            res.redirect('/');
        } else {
            console.log(result.following.indexOf(result._id));
            res.render('profile', {
                pageTitle: result.username,
                user: req.session.user,
                user_searched: result
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.GetEditUser = async (req, res) => {
    await User.findById(req.params.id)
    .then(result => {
        if (result === null) {
            let message = 'User not found!';
            console.log(message);
            res.redirect('/user/' + req.session.user._id);
        } else {
            res.render('editUser', {
                pageTitle: result.username,
                user: req.session.user,
                user_searched: result
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/user/' + req.session.user._id);
    });
}

exports.GetDeleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    .then(result => {
        if (result === null) {
          let message = 'User not found!';
          console.log(message);
          res.redirect('/user/' + req.session.user._id);
        } else {
            console.log('Usuário deletado com sucesso');
            if(req.session.user.isadmin) {
                res.redirect('/');
            } else {
                req.session.destroy();
                res.redirect('/login');
            }
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/user/' + req.session.user._id);
    });
}

exports.PostEditUser = async (req, res) => {
    let user;
    if(req.file) {
        user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            profile_image: req.file.path,
        };
    } else {
        user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        };
    }
    await User.findByIdAndUpdate(req.params.id, user, { new: true })
    .populate(['following', 'followers'])
    .then(result => {
        if (result === null) {
            let message = 'Something going wrong, try again!';
            res.send(message);
        } else {
            if(req.session.user._id != req.params.id) {
            
            } else {
                eq.session.user = result;
            }
            let message = 'User ' + result.username + ' updated successfully!';
            console.log(message);
            res.redirect('/user/' + result._id);
        }
    })
    .catch(err => {
        console.log(err);
        let message = 'Something going wrong, try again!';
        res.send(message);
    });
};

exports.GetUsers = async (req, res) => {
    if(req.query.search) {
        await User.find({ username: req.query.search}).then(result => {
          if(result[0]) {
            res.render('users', {
              pageTitle: 'Users',
              user: req.session.user,
              users: result,
            })
          } else {
            res.send('Nenhum usuário encontrado');
          }
        }).catch(err => {
          console.log(err);
          res.redirect('/users');
        })
          res.send(req.query.search)
    } else {
        // populate(['following', 'followers'])
        await User.find().then(result  => {
            // res.send({result})
            res.render('users', {
            pageTitle: 'Users',
            user: req.session.user,
            users: result,
        });
        }).catch(err => {
            console.log(err);
            res.redirect('/users');
        });
    }    
}

exports.GetFollowUser = async (req, res) => {
    let user_following = await User.findById(req.session.user._id).then().catch(err => console.log(err));
    let user_followed = await User.findById(req.params.id).then().catch(err => console.log(err));

    if(user_following.following.indexOf(user_followed._id) == -1) {
        user_followed.followers.push(req.session.user._id);
        user_following.following.push(req.params.id); 

        await User.findByIdAndUpdate(req.params.id, user_followed);
        await User.findByIdAndUpdate(req.session.user._id, user_following, { new: true }).then(result => {
            req.session.user = result;
            res.redirect('/users');
        }).catch(err => {
            console.log(err);
            res.redirect('/users');
        });
    } else {
        res.send('Voce ja segue esse usuário');
    }
}

exports.GetUnfollowUser = async (req, res) => {
    let user_unfollowing = await User.findById(req.session.user._id).then().catch(err => console.log(err));
    let user_followed = await User.findById(req.params.id).then().catch(err => console.log(err));

    if(user_unfollowing.following.indexOf(user_followed._id) != -1) {
        user_followed.followers.splice(user_followed.followers.indexOf(req.session.user._id), 1);
        user_unfollowing.following.splice(user_unfollowing.following.indexOf(req.params.id), 1);
        
        await User.findByIdAndUpdate(req.params.id, user_followed);
        await User.findByIdAndUpdate(req.session.user._id, user_unfollowing, { new: true }).then(result => {
            req.session.user = result;
            res.redirect('/users');
        }).catch(err => {
            console.log(err);
            res.redirect('/users');
        });
    } else {
        res.send('Voce não segue esse usuário');
    }
}

exports.GetFollowing = async (req, res) => {
    await User.findById(req.params.id)
    .populate(['following', 'followers'])
    .then(result => {
        if (result === null) {
            let message = 'User not found!';
            console.log(message);
            res.redirect('/');
        } else {
            res.render('following', {
                pageTitle: 'Usuários seguidos',
                user: req.session.user,
                users: result.following
            });
        }
    })
    .catch(err => {
        console.log(err); 
        res.redirect('/login');
    });
}

exports.GetFollowers = async (req, res) => {
  await User.findById(req.params.id)
  .populate(['following', 'followers'])
  .then(result => {
      if (result === null) {
          let message = 'User not found!';
          console.log(message);
          res.redirect('/');
      } else {
          res.render('followers', {
              pageTitle: 'Seguidores',
              user: req.session.user,
              users: result.followers
          });
      }
  })
  .catch(err => {
      console.log(err); 
      res.redirect('/login');
  });
}
