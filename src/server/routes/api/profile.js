const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');


/** 
 * @route POST api/profile/
 * @desc Create or edit user profile
 * @access Private 
 */
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        profile = Object.assign(profile, req.body);
        profile.save()
          .then(profile => {
            return res.status(200).json(profile)
          })
          .catch(err => res.status(500).send(err))
      } else {
        let profile = new Profile(Object.assign({
          user: req.user.id
        }, req.body));
        profile.save(err => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).json(profile);
        })
      }
    })
    .catch(err => {
      if (err) {
        res.status(404).json(err);
      }
    });
});


/** 
 * @route POST api/profile/experience
 * @desc Add experience user profile
 * @access Private 
 */

router.post('/experience', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        profile = Object.assign(profile, req.body);
        profile.save()
          .then(profile => {
            return res.status(200).json(profile)
          })
          .catch(err => res.status(500).send(err))
      } else {
        return res.status(404);
      }
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
