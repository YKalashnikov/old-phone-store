const {Router} = require('express')
const Phone = require('../models/phone')
const auth = require('../middleware/auth')
const router = Router()


function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.phoneId._doc, 
    id: c.phoneId.id,
    count: c.count
  }))
}

function computePrice(phones) {
  return phones.reduce((total, phone) => {
    return total += phone.price * phone.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  const phone = await Phone.findById(req.body.id)
  await req.user.addToCart(phone)
  res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.phoneId').execPopulate()
  const phones = mapCartItems(user.cart)
  const cart = {
    phones, price: computePrice(phones)
  }
  res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.phoneId')
    .execPopulate()

  const phones = mapCartItems(user.cart)

  res.render('card', {
    title: 'Cart',
    isCard: true,
    phones: phones,
    price: computePrice(phones)
  })
})

module.exports = router