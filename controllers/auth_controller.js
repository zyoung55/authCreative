var crypto = require('crypto');
var mongoose = require('mongoose');
User = mongoose.model('User');
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64').toString();
}

exports.signup = function(req, res) {
    console.log("in sign up!!");
    console.log("signup username!");
    console.log(req.body.username);
    console.log(req.body.password);
    
    User.findOne({username: req.body.username}, function (err, user) {
        if (user) { 
            req.session.message = "There was an error. Someone is already using that username.";
            console.log("Check failed");
            res.redirect('/signup');
            return;
        }
        else {
            console.log("Check passed");
            var user = new User({username:req.body.username})
            var hashedPassword = hashPassword(req.body.password);
            user.set('hashedPassword', hashedPassword);
            user.save(function(err, user) {
            if (user) {
                console.log("user id: " + user.id);
                console.log("user username: " + user.username);
                console.log("user hashedPassword: " + user.hashedPassword);
                req.session.user = user.id;
                req.session.username = user.username; 
                req.session.message = "User added!";
                res.redirect('/');
            }
            else {
                req.session.message = "Sign up failed."
                res.redirect('/signup');
            }
            });
        }
    }); 
};

exports.login = function(req, res) {
    User.findOne({username: req.body.username}).exec(function(err, user) {
        if (user) {
                console.log("user id: " + user.id);
                console.log("user username: " + user.username);
                console.log("user hashedPassword: " + user.hashedPassword);
                req.session.user = user.id;
                req.session.username = user.username; 
                req.session.message = "User added!";
                res.redirect('/');
        }
        else {
            req.session.message = "Login failed.";
            res.redirect('/');
        } 
    })
};

exports.addBook = function(req, res) {
    console.log("In addBook");  
    console.log("Book, Url, numXread, read desire");
    console.log(req.body.book);
    console.log(req.body.bookUrl);
    console.log(req.body.numRead);
    console.log(req.body.readDesire);
    User.findOne({username: req.session.username}).exec(function(err, user) {
        if (user) {
            user.books.push({book: req.body.book, bookUrl: req.body.bookUrl, numRead: req.body.numRead, readDesire: req.body.readDesire});
            user.save();
            res.send(req.body);
        }
        else {
            console.log("Do something later on.");
        }
    });
};

exports.getBooks = function(req, res) {
    User.findOne({username: req.session.username}).exec(function(err, user) {
        if(user) {
            res.send(user.books);
        }
        else {
            console.log("Do something later.");
        }
    })
};