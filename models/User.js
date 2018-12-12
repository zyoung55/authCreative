/* User.js */
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: String,
    hashedPassword: String,
    books: [{}]
});

mongoose.model('User', UserSchema);

