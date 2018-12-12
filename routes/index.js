var express = require('express');
var router = express.Router();
var expressSession = require('express-session');

var users = require('../controllers/auth_controller'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.username) {
    res.redirect("/login");
  }
  else if (req.session.username) {
    res.render('userpage.html', {message: req.session.message, username: req.session.username});
  }
});

/* Renders the signup static file. */
router.get('/signup', function(req, res, next) {
  if (!req.session.message) {
    res.render('signup.html');
  }
  else if (!req.session.username) {
      res.render('signup.html', {message: req.session.message});
  }
});

/* Destroys the session when logout occurs and redirects to the root page. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

/* Renders the login page. */
router.get('/login', function(req, res, nexxt) {
  if (!req.session.message) req.session.message = "Not currently logged on.";
    res.render('login.html', {message: req.session.message});
});

/* Functions that are exported from controllers/auth_controller.js to aid in server processes. */
router.post('/login', users.login);
router.post('/addBook', users.addBook);
router.post('/signup', users.signup);
router.get('/getBooks', users.getBooks);
router.put('/deleteBook', users.deleteBook);
router.delete('/deleteAccount', users.deleteAccount);

module.exports = router;
