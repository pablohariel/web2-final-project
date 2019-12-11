const Movie = require('../models/Movie');

exports.GetAddMovie = (req, res) => {
  if (req.session.isadmin) {
      res.render('addMovie', {
          pageTitle: 'Add Filme',
          loggedIn: req.session.isLoggedIn,
          user: req.session.user
      });
  } else {
      res.redirect('/login');
  }
};

exports.PostAddMovie = (req, res) => {
    const title = req.body.title;
    const date = req.body.date;
    const genre = req.body.genre;
    const description = req.body.description;
    const img = req.body.imageUrl;
    const movie = new Movie({
        title: title,
        date: date,
        genre: genre,
        description: description,
        img: img
    });
    movie
        .save()
        .then(result => {
            console.log('Filme criado!');
            res.redirect('/admin/addMovie');
        })
        .catch(error => {
            console.log(error);
        });
};

exports.DeleteMovie = (req, res) => {
    Movie.findByIdAndRemove(req.params.id)
        .then(result => {
            res.redirect('/');
        })
        .catch(error => {
            console.log(error);
        });
  };
