const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../../models/Post')
const validatePostInput = require('../../validation/post')
/** @route POST api/post
@desc Create post
@access Private */

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid} = validatePostInput(req.body);
    console.log(req.user)
    if(!isValid){
        return res.status(400).json(errors)
    }
    let shareFields={
        facebook:'',
        twitter:''
    }
    shareFields.facebook= req.body.facebook;
    shareFields.twitter = req.body.twitter;
    const newPost = new Post({
        postTitle:req.body.postTitle,
        postPermaLink:req.body.postPermaLink,
        postAuthor:req.body.postAuthor,
        postImage:req.body.postImage,
        postVideo:req.body.postVideo,
        postAuthor:req.user,
        postContent:req.body.postContent,    
        tags: req.body.tags? req.body.tags.split(','):'',
        share:shareFields,
    })

    newPost.save().then(post=>res.json(post))


})
module.exports = router;