var mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://admin:sdAyocC32n5sx5aRRPpH@playgroundcluster-kiusn.mongodb.net/test?retryWrites=true', {useNewUrlParser: true, dbName: 'db'});
mongoose.connect('mongodb://127.0.0.1:27017/test?retryWrites=true', {useNewUrlParser: true, dbName: 'db'});

var db = mongoose.connection;

// Post schema
var postSchema = mongoose.Schema({

    title: {
        type: String
    },
    content: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    creationDate: {
        type: Date
    }
});

var Post = module.exports = mongoose.model('Post', postSchema, 'posts');

module.exports.getPostById = function(id, callback){
    Post.findById(id, callback);
}

module.exports.getAllPosts = function(callback){
    Post.find(callback).populate('author');
}



module.exports.createPost = function(newPost, callback) {

    newPost.save(callback);
       
    console.log('Post created and saved to db.');
}