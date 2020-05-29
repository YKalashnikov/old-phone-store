const {Router} = require('express')
const {validationResult} = require('express-validator/check')
const Phone = require('../models/phone')
const auth = require('../middleware/auth')
const {phoneValidators} = require('../utils/validators')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add Phone',
    isAdd: true
  })
})

router.post('/', auth, phoneValidators, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add Phone',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        img: req.body.img
      }
    })
  }

  const phone = new Phone({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    img: req.body.img,
    userId: req.user
  })

  try {
    await phone.save()
    res.redirect('/phones')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router