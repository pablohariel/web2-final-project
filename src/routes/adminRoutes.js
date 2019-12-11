const express = require('express');
const router = express.Router();

const Controle = require('./../controllers/adminController');

router.get('/addMovie', Controle.GetAddMovie);
router.post('/addMovie', Controle.PostAddMovie);
router.get('/deleteMovie/:id', Controle.DeleteMovie);

module.exports = router;
