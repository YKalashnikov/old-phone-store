const {Schema, model} = require('mongoose')

const phoneSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
     type: String,
     required: true,
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

phoneSchema.method('toClient', function() {
  const phone = this.toObject()

  phone.id = phone._id
  delete phone._id

  return phone
})

module.exports = model('Phone', phoneSchema)