const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }, //we're using the objectId given to every object in the DB to access the user who posted it
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], //it is an array of user objects, the sqaure brackets tell that its an array
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], //array of users
    retweetData: { type: Schema.Types.ObjectId, ref: 'Post' }, //it will have the post data!
    replyTo: { type: Schema.Types.ObjectId, ref: 'Post' },
    pinned: Boolean
}, { timestamps: true });

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;