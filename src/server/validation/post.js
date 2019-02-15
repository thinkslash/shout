const Validator = require('validator');
const isEmpty = require('./is-empty')
module.exports = function validatePostInput(data) {
    let errors = {};
    data.postTitle = !isEmpty(data.postTitle) ? data.postTitle : '';
    data.postAuthor = !isEmpty(data.postAuthor) ? data.postAuthor : '';
    data.postContent = !isEmpty(data.postContent) ? data.postContent : '';

    if (!Validator.isLength(data.postContent, { min: 20, max: 3000 })) {
        errors.postContent = 'Post Content needs to be between 20 and4 4000 characters.'
    }

    if (!Validator.isLength(data.postTitle, { min: 5, max: 140 })) {
        errors.postTitle = 'Post Title needs to be between 5 and4 140 characters.'
    }
    if (Validator.isEmpty(data.postTitle)) {
        errors.postTitle = 'Post Title is required.'
    }

    if (Validator.isEmpty(data.postContent)) {
        errors.postContent = 'Please put some content in post.'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}