const Movie = require('../models/Movie');
const User = require('../models/User');
const Comment = require('../models/Comment');

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

exports.Details = (req, res) => {
    Movie.findById(req.params.id)
    .then(movie => {
        Comment.find({movieId: movie._id})
        .populate({path: 'authorId', model: User, select:'username'})
        .then(comments => {
            res.render('details',
        {
            pageTitle: movie.title,
            movie: movie, 
            user : req.session.user,
            comments: comments
        })
        })
    }).catch(err => {
        res.redirect('/');
    })
    
}

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
    console.log(req.files[0].path)
    if(req.files) {
        user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            profile_image: req.files[0].path,
            images: []
        };
    } else {
        user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        };
    }

    await req.files.forEach(file => {
        user.images.push(file.path);
    });

    await User.findByIdAndUpdate(req.params.id, user, { new: true })
    .populate(['following', 'followers'])
    .then(result => {
        if (result === null) {
            let message = 'Something going wrong, try again!';
            res.send(message);
        } else {
            if(req.session.user._id != req.params.id) {
            
            } else {
                req.session.user = result;
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

exports.GetSearched = async (req, res) => {
    if(req.query.search) {
        await User.find({ username: req.query.search}).then(result => {
          if(result[0]) {
            res.render('search', {
              pageTitle: 'Search',
              user: req.session.user,
              users: result,
              movies: null,
              searched: req.query.search,
            })
            } else {
            Movie.find({ title: req.query.search}).then(result => {
                if(result[0]) {
                  res.render('search', {
                    pageTitle: 'Search',
                    user: req.session.user,
                    movies: result,
                    users: null,
                    searched: req.query.search,
                  })
                } else {
                    res.render('search', {
                        pageTitle: 'Search',
                        user: req.session.user,
                        users: null,
                        movies: null,
                        searched: req.query.search,
                    })
                }
            }).catch(err => {
                console.log(err);
                res.redirect('/users');
              })
            }
        }).catch(err => {
          console.log(err);
          res.redirect('/users');
        })
    }  
}

exports.PostSearch = async (req, res) => {
    let search = req.body.search;
    res.redirect('/search?search=' + search);
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
            res.redirect('/user/' + req.params.id);
        }).catch(err => {
            console.log(err);
            res.redirect('/user/' + req.params.id);
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
            res.redirect('/user/' + req.params.id);
        }).catch(err => {
            console.log(err);
            res.redirect('/user/' + req.params.id);
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

exports.GetWatchedMovies = async (req, res) => {
    await User.findById(req.params.id)
    .then(user => {
        Movie.find({_id: user.watchedMovies})
        .then(movies => {
            res.render('watched_movies_list', {
            pageTitle: "Watched Movies",
            user : req.session.user,
            movies: movies
        })
        })
    }) 
    .catch(error => {
        console.log(error);
        res.redirect('/');
    })
}

exports.GetWatchMovies = (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        Movie.find({_id: user.watchlist})
        .then(movies => {
            res.render('watch_movies_list', {
            pageTitle: "Watch Movies",
            user : req.session.user,
            movies: movies
        })
        })
    }) 
    .catch(error => {
        console.log(error);
        res.redirect('/');
    }) 
}


// revisar

exports.WatchedMovie = (req, res) => {
    //não deixar adicionar filme repetido!

   /* if(req.session.loggedIn){
        User.findById(req.params.id)
        .then(user => {
            Movie.findById(req.params.movieId)
            .then(movie => {
                user.watchedMovies.push({ObjectId: movie._id, watched: true});
                console.log("id do filme: " + user.watchedMovies[watchedMovies.length-1].movieId);
                user.save()
                .then(result => {
                    res.redirect('/');
                })
                
            })
            .catch(erro => {
                console.log(erro);
            })
        })
    }*/ 

        User.findById(req.params.id)
        .then(user => {
            Movie.findById(req.params.movieId)
            .then(movie => {
                user.watchedMovies.push(req.params.movieId);
                console.log("id do filme: " + user.watchedMovies);
                user.save()
                .then(result => {
                    req.session.user = result,
                    res.redirect('/details/' + req.params.movieId);
                })
                
            })
            .catch(erro => {
                console.log(erro);
            })
        })
    

    
}

exports.RemoveWatched = (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        for(let i=0; i<user.watchedMovies.length; i++) {
            if(user.watchedMovies[i] == req.params.movieId){
                user.watchedMovies.splice(i, 1);
                user.save()
                .then(result => {
                    req.session.user = result,
                    res.redirect('/watchedMovies/' + req.params.id);
                })
            }
        }
    })
}

exports.Watchlist = (req, res) => {
    //não deixar adicionar filme repetido!
    User.findById(req.params.id)
    .then(user => {
        Movie.findById(req.params.movieId)
        .then(movie => {
            user.watchlist.push(req.params.movieId);
            console.log("id do filme: " + user.watchlist);
            user.save()
            .then(result => {
                req.session.user = result,
                res.redirect('/details/' + req.params.movieId);
            })
        })
        .catch(erro => {
            console.log(erro);
        })
    });
}

exports.RemoveWatchlist = (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        for(let i=0;i<user.watchlist.length;i++){
            if(user.watchlist[i] == req.params.movieId){
                user.watchlist.splice(i, 1);
                user.save()
                .then(result => {
                    req.session.user = result,
                    res.redirect('/watchMovies/' + req.params.id);
                })
            }
        }
    })
}

exports.PostAddComment = (req, res) => {
   Movie.findById(req.params.movieId)
   .then(movie => {
        newComment = new Comment({
            authorId: req.params.id,
            text: req.body.text, 
            movieId: req.params.movieId
        });
        newComment.save()
        .then(result => {
            console.log("comentario salvo");
            console.log("id do novo comentario:" + newComment._id);
            //artigo.comments.push(newComment._id);
            //artigo.save();
            res.redirect('/details/' + req.params.movieId);
        })        
        
    })
};

exports.RemoveComment = (req, res) => {
    const id = req.params.id;
    Comment.findByIdAndRemove(req.params.commentId)
    .then(result=>{
        res.redirect('/details/' + id);
    })
    .catch(error => {
        console.log(error);
    })
}
