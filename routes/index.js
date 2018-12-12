var express = require('express');
var router = express.Router();
var expressSession = require('express-session');

var users = require('../controllers/auth_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("In '/' get.");
  if (!req.session.username) {
    res.redirect("/login");
  }
  else if (req.session.username) {
    console.log("message:" + req.session.message);
    res.render('userpage.html', {message: req.session.message, username: req.session.username});
    console.log("Your logged in bro");
  }
});

router.get('/signup', function(req, res, next) {
  if (!req.session.message) {
    res.render('signup.html');
  }
  else if (!req.session.username) {
      res.render('signup.html', {message: req.session.message});
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

router.get('/login', function(req, res, nexxt) {
  if (!req.session.message) req.session.message = "Not currently logged on.";
    res.render('login.html', {message: req.session.message});
});

router.post('/login', users.login);
router.post('/addBook', users.addBook);
router.post('/signup', users.signup);
router.get('/getBooks', users.getBooks);
router.put('/deleteBook', users.deleteBook);
router.delete('/deleteAccount', users.deleteAccount);

module.exports = router;
