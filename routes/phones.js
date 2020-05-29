const {Router} = require('express')
const {validationResult} = require('express-validator/check')
const Phone = require('../models/phone')
const auth = require('../middleware/auth')
const {phoneValidators} = require('../utils/validators')
const router = Router()

function isOwner(phone, req) {
  return phone.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const phones = await Phone.find()
    .populate('userId', 'email name')
    .select('price title description img')

    res.render('phones', {
      title: 'Phones',
      isPhones: true,
      userId: req.user ? req.user._id.toString() : null,
      phones
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    const phone = await Phone.findById(req.params.id)
    if (!isOwner(phone, req)) {
      return res.redirect('/phones')
    }

    res.render('phone-edit', {
      title: `Edit ${phone.title}`,
      phone
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', auth, phoneValidators, async (req, res) => {
  const errors = validationResult(req)
  const {id} = req.body

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/phones/${id}/edit?allow=true`)
  }

  try {
    delete req.body.id
    const phone = await Phone.findById(id)
    if (!isOwner(phone, req)) {
      return res.redirect('/phones')
    }
    Object.assign(phone, req.body)
    await phone.save()
    res.redirect('/phones')
  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Phone.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/phones')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id)
    res.render('phone', {
      layout: 'empty',
      title: `Phone ${phone.title}`,
      phone
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router