/* auth_controller.js */
var crypto = require('crypto');
var mongoose = require('mongoose');
User = mongoose.model('User');
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64').toString();
}

/* Export function to enable a user to sign up. */
exports.signup = function(req, res) {
    if (req.body.password != req.body.confirmPassword) {
        req.session.message = "There was an error. Your password and confirm password did not match.";
        res.redirect('/signup');
    }
    else {
        User.findOne({username: req.body.username}, function (err, user) {
            if (user) { 
                req.session.message = "There was an error. Someone is already using that username.";
                res.redirect('/signup');
                return;
            }
            else {
                var user = new User({username:req.body.username})
                var hashedPassword = hashPassword(req.body.password);
                user.set('hashedPassword', hashedPassword);
                user.save(function(err, user) {
                if (user) {
                    req.session.user = user.id;
                    req.session.username = user.username; 
                    req.session.message = "User added!";
                    res.redirect('/');
                }
                else {
                    req.session.message = "Sign up failed.";
                    res.redirect('/signup');
                }
                });
            }
        }); 
    }
};

/* Export function to enable a user to login. */
exports.login = function(req, res) {
    User.findOne({username: req.body.username}).exec(function(err, user) {
        if (user) {
            if(hashPassword(req.body.password) == user.hashedPassword) {
                req.session.user = user.id;
                req.session.username = user.username; 
                req.session.message = "User added!";
                res.redirect('/');
            }
            else {
                req.session.user = null;
                req.session.message = "Wrong username/password combination.";
                res.redirect('/');
            }
        }
        else {
            req.session.message = "Login failed.";
            res.redirect('/');
        } 
    });
};

/* Export function to allow a user to add a book to the database. */
exports.addBook = function(req, res) {
    User.findOne({username: req.session.username}).exec(function(err, user) {
        if (user) {
            user.books.push({book: req.body.book, bookUrl: req.body.bookUrl, numRead: req.body.numRead, readDesire: req.body.readDesire});
            user.save();
            res.send(req.body);
        }
        else {
            console.log("There was an error accessing the user.");
        }
    });
};

/* Export function to all the books for a user from the database. */
exports.getBooks = function(req, res) {
    User.findOne({username: req.session.username}).exec(function(err, user) {
        if(user) {
            res.send(user.books);
        }
        else {
            console.log("There was an erro accessing the user.");
        }
    });
};

/* Export function to allow a user to delete a book from the database. */
exports.deleteBook = function(req, res) {
    User.findOne({username: req.session.username}).exec(function(err, user) {
       if (user) {
           for(var i = 0; i < user.books.length; i++) {
               if (user.books[i].book == req.body.book) {
                   user.updateOne({$pull: {'books': { book: req.body.book}} }, function(err) {
                       if (err) {
                           console.log("There was an error in the pull.");
                       }
                       else {
                           res.send("success");
                       }
                   });
               }
           }
       } 
    });
};

/* Export function to delete a user from the database. */
exports.deleteAccount = function(req, res) {
    User.findOne({username: req.session.username}).exec(function(err, user) {
       if (user) { 
           user.remove();
           req.session.destroy(function() {
           });
           res.end();
       }
       else {
           console.log("There was an error deleting the account.");
       }
    });
};