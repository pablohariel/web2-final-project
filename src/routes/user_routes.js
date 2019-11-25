const express = require('express');
const router = express.Router();

const signup_controller = require('../controllers/signup_controller');
const login_controller = require('../controllers/login_controller');
const user_controller = require('../controllers/user_controller');

router.post('/signup', signup_controller.Signup);
router.post('/login', login_controller.Login);
router.put('/user/:id', user_controller.Update);
router.delete('/user/:id', user_controller.Delete);

module.exports = router;