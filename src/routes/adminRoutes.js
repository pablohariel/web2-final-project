const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/addMovie', adminController.GetAddMovie);
router.post('/addMovie', adminController.PostAddMovie);
router.get('/deleteMovie/:id', adminController.DeleteMovie);

router.get('/addLots', adminController.AddLots);

module.exports = router;
