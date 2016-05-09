var authRouter = require('express').Router();
var userController = require('../controllers/userController');
var util = require('../lib/utility.js');
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;
var User = require('../models/user');

authRouter.route('/')
  .get(passport.authenticate('github', {scopes: [ 'user:email' ]}));

authRouter.route('/logout')
  .get(function(req, res) {
    //Destroy session, clear client cookies, and redirect to login page
    req.logout();
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } 
      res.clearCookie('ac')
      res.clearCookie('cu')
      res.redirect('/login');
      
    });
  });


authRouter.route('/error')
  .get(function(req, res) {
    res.redirect('/login');
  });

authRouter.route('/callback')
    .get(passport.authenticate('github', { failureRedirect: '/auth/error'}),
    function(req, res) {
      //Fetch user from DB, store their permission status and user id in cookies, redirect to root or dashboard
      //depending on whether user is admin or not
      User.where({githubid: req.user.userData.githubid}).fetch()
        .then(function(user) {
          var store = user.attributes.permission === 1 ? 1 : 0;
          res.cookie('ac', store, { httpOnly: false})
          res.cookie('cu', user.id, { httpOnly: false});
          if (store === 1) {
            res.redirect('/dashboard');
          } else {
            res.redirect('/');
          }
     
        });
    });

authRouter.route('/islogged') 
  .get(util.isLoggedIn, function(req, res){
    res.status(200).send('true');
  });

authRouter.route('/isadmin') 
  .get(util.isLoggedIn, util.isAdmin, function(req, res){
    res.status(200).send('true');
  }); 

module.exports = authRouter;
