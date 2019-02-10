const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

/** @route GET api/profile
@desc Get Current user profile
@access Private */

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
          if (!profile) {
              errors.noprofile = 'Profile not found.'
              res.status(404).json(errors)
          }
          res.json(profile);
      })
      .catch(err => res.status(404).json(err))
})
 
/** @route GET api/profile/all
@desc Get all profiles
@access Public */

router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
      .populate('user', ['name', 'avatar'])
      .then(profiles => {
          if (!profiles) {
              errors.noprofile = 'There are no profiles.'
              res.status(400).json(errors);

          }
          res.json(profiles);

      })
      .catch(err => res.status(404).json({ profile: 'There are no profiles.' }))
})

/** @route GET api/profile/handle/:handle
@desc Get profile by handle
@access Public */

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
          if (!profile) {
              errors.noprofile = 'There is no profile for this handle.'
              res.status(400).json(errors);

          }
          res.json(profile);

      })
      .catch(err => res.status(404).json({ profile: 'There is no profile for this user.' }))
})

/** @route GET api/profile/user/:user_id
@desc Get profile by user ID
@access Public */

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
          if (!profile) {
              errors.noprofile = 'There is no profile for this handle.'
              res.status(400).json(erros);

          }
          res.json(profile);

      })
      .catch(err => res.status(404).json({ profile: 'There is no profile for this user.' }))
})

/** @route POST api/profile
@desc Create or edit user profile
@access Private */

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body)
  if (!isValid) {
      res.status(400).json(errors);
      res.end();
  } else {
      const profileFields = {};
      profileFields.user = req.user.id;
      if (req.body.handle) profileFields.handle = req.body.handle;
      if (req.body.company) profileFields.company = req.body.company;
      if (req.body.website) profileFields.website = req.body.website;
      if (req.body.location) profileFields.location = req.body.location;
      if (req.body.bio) profileFields.bio = req.body.bio;
      if (req.body.status) profileFields.status = req.body.status;
      if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
      if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',')
      profileFields.social = {};
      if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
      if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
      if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

      Profile.findOne({ user: req.user.id })
          .then(profile => {
              if (profile) {
                  Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                      .then(profile => res.json(profile))
              } else {
                  Profile.findOne({ handle: profileFields.handle })
                      .then(profile => {
                          if (profile) {
                              errors.handle = 'Handle already exits.'
                              res.status(400).json(errors)
                              res.end();
                          }

                          new Profile(profileFields).save()
                              .then(profile => {
                                  res.json(profile)
                              })
                      })
              }
          })
  }
})

/** @route DELETE api/profile
@desc Delete user profile
@access Private */
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  console.log('got request')
  Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
          User.findOneAndRemove({ _id: req.user.id })
              .then(() => res.json({ success: "true" }))
      })
      .catch(err => res.status.json(err))
})


/** @route POST api/profile/experience
@desc Add experience user profile
@access Private */

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body)
  if (!isValid) {
      res.status(400).json(errors);

  }

  Profile.findOne({ user: req.user.id })
      .then(profile => {
          if (!profile) {

          }
          const newExp = {
              title: req.body.title,
              company: req.body.company,
              location: req.body.location,
              from: req.body.from,
              to: req.body.to,
              current: req.body.current,
              description: req.body.description
          }
          profile.experience.unshift(newExp);
          profile.save().then(profiles => res.json(profiles));
      })
})

/** @route POST api/profile/education
@desc Add eductation to user profile
@access Private */

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body)
  if (!isValid) {
      res.status(400).json(errors);

  }

  Profile.findOne({ user: req.user.id })
      .then(profile => {
          if (!profile) {

          }
          const newEducation = {
              school: req.body.school,
              degree: req.body.degree,
              fieldofstudy: req.body.fieldofstudy,
              from: req.body.from,
              to: req.body.to,
              current: req.body.current,
              description: req.body.description
          }
          profile.education.unshift(newEducation);
          profile.save().then(profiles => res.json(profiles));
      })
})


/** @route DELETE api/profile/experience
@desc Delete experience from user profile
@access Private */
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {


  Profile.findOne({ user: req.user.id })
      .then(profile => {
          const removeIndex = profile.experience
              .map(item => item.id)
              .indexOf(req.params.exp_id);
          profile.experience.splice(removeIndex, 1);

          profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status.json(err))
})

/** @route DELETE api/profile/education
@desc Delete education from user profile
@access Private */
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {


  Profile.findOne({ user: req.user.id })
      .then(profile => {
          const removeIndex = profile.education
              .map(item => item.id)
              .indexOf(req.params.exp_id);
          profile.education.splice(removeIndex, 1);

          profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status.json(err))
})

module.exports = router;
