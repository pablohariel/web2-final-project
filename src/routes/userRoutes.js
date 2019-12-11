const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('./../controllers/userController');
const loginController = require('./../controllers/loginController');
const signupController = require('./../controllers/signupControler');

const storageFunction = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/userImages/')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.email + '-' + Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage: storageFunction })

const { isLoggedIn, isNotLoggedIn, havePermission } = require('../middleware/auth');

router.get('/', userController.GetHome);
router.get('/movie/:id', userController.MovieDetails);

router.get('/login', isNotLoggedIn, loginController.GetLogin);
router.post('/login', isNotLoggedIn, loginController.PostLogin);
router.get('/logout', isLoggedIn, loginController.Logout);
router.get('/signup', isNotLoggedIn, signupController.GetSignup);
router.post('/signup', isNotLoggedIn, signupController.PostSignup);
router.get('/user/:id', isLoggedIn, userController.UserDetails);
router.get('/user/edit/:id', isLoggedIn, havePermission, userController.GetEditUser);
router.post('/user/edit/:id', isLoggedIn, havePermission, upload.single('image'), userController.PostEditUser);
router.get('/user/delete/:id', isLoggedIn, havePermission, userController.GetDeleteUser);
router.get('/users', isLoggedIn, userController.GetUsers);
router.get('/user/follow/:id', isLoggedIn, userController.GetFollowUser);
router.get('/user/unfollow/:id', isLoggedIn, userController.GetUnfollowUser);
router.get('/user/:id/following', isLoggedIn, userController.GetFollowing);
router.get('/user/:id/followers', isLoggedIn, userController.GetFollowers);

module.exports = router;
