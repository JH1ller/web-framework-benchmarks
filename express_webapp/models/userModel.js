var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//mongoose.connect('mongodb+srv://admin:sdAyocC32n5sx5aRRPpH@playgroundcluster-kiusn.mongodb.net/test?retryWrites=true', {useNewUrlParser: true, dbName: 'db'});
mongoose.connect('mongodb://127.0.0.1:27017/test?retryWrites=true', {useNewUrlParser: true, dbName: 'db'});

var db = mongoose.connection;

// User schema
var userSchema = mongoose.Schema({

    username: {
        type: String,
        index: true,
        unique: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profileImage: {
        type: String
    },
    creationDate: {
        type: Date
    }
});

var User = module.exports = mongoose.model('User', userSchema, 'users');

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

module.exports.createUser = function(newUser, callback) {

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
    console.log('User created and saved to db.');
}