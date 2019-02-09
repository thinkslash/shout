const express = require('express');
const gravatar = require('gravatar')
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const SECRET = require('../../config/keys').JWTSECRET
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// @route GET api/users/register
// @desc  Register User 
// @access Public
router.post('/register',(req,res)=>{

    const {errors,isValid} = validateRegisterInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                errors.email = 'Email already exists';
                return res.status(400).json(errors)
            }else{
                const avatar = gravatar.url(req.body.email,{
                    s:'200',
                    r:'pg',
                    d:'mm'
                })
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar ,
                    password:req.body.password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password= hash;
                        newUser.save()
                                .then(user=>{
                                    res.json(user)
                                })
                                .catch(err=>console.log(err))
                    })
                })
            }
        })
})

// @route GET api/users/login
// @desc  Login User / Return JWT
// @access Public
router.post('/login',(req,res)=>{
    const {errors,isValid} = validateLoginInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

   
    User.findOne({email})
        .then(user=>{
            if((!user)){
                errors.email = 'User not found';
                res.status(404).json(errors)
            }

            bcrypt.compare(password,user.password)
                  .then(isMatch=>{
                      if(isMatch){
                         const payload = {
                             id:user.id,
                             name:user.name,
                             avatar:user.avatar
                         }
                         jwt.sign(payload,SECRET,{expiresIn:3600},(err,token)=>{
                             res.json({
                                 success:true,
                                 token:'Bearer '+token
                             })
                         })
                      }else{
                          errors.password = 'Password Incorrect'
                          res.status(400).json(errors)
                      }
                  })
        })
})

// @route GET api/users/current
// @desc  Return Current User 
// @access Private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    })
})

module.exports = router;