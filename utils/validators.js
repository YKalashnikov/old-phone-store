const {body} = require('express-validator/check') 
const User = require('../models/user')

exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Enter the right email')
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('This email already exist')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('password', 'The password has to be at least 6 symbols')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('The passwords have to match')
      }
      return true
    })
    .trim(),
  body('name')
    .isLength({min: 3}).withMessage('The name has to be at least 3 symbols')
    .trim()
]


exports.phoneValidators = [
  body('title').isLength({min: 3}).withMessage('The minimum length has to be at least 3 symbols').trim(),
  body('price').isNumeric().withMessage('Enter the right price'),
  body('img', 'Enter the right Url of the image').isURL(),
  body('description')
  .isLength({min:5}).withMessage('Description has to be at lest 5 symbols')
]