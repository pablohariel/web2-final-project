const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');
const pages_controller = require('../controllers/pagesController');

router.get('/signup', pages_controller.Render_signup);
router.get('/login', pages_controller.Render_login);
router.get('/home', pages_controller.Render_home);
router.get('/profile/:id', pages_controller.Render_profile);

router.get('/signout', user_controller.Signout);
router.post('/signup', user_controller.Signup);
router.post('/login', user_controller.Login);
router.put('/user/:id', user_controller.Update);
router.delete('/user/:id', user_controller.Delete);

module.exports = router;