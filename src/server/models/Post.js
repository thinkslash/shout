const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId
    },
    postTitle: {
        type: String,
        required: true
    },
    postPermaLink: {
        type: String
       
    },
    postTimestamp: {
        type: Date,
        required: true,
        default:Date.now
    },
    postAuthor: {
        type: Schema.Types.ObjectId,
        refs: 'users',
        required: true
    },
    postImage: {
        type: String
    },
    postVideo: {
        type: String
    },
    postContent: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    share: {
        facebook:{
            type: String
        },
        twitter:{
            type: String
        }
    },
    comments: [{
    id: {
        type: Schema.Types.ObjectId,
    },
    author:{
        type: Schema.Types.ObjectId,
        refs: 'users'
    },
    timestamp:{
        type: Date,
        required:true,
        default:Date.now
    },
    content: {
        type: String
    },
    score: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
  }]
})

module.exports = Post = mongoose.model('post', PostSchema);
