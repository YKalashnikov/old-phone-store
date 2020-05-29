const keys = require('../keys')

module.exports = function(email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Reset password',
    html: `
      <h1>Forgot password?</h1>
      <p>If it was not you just ignore the message</p>
      <p>Or simply click the button below:</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset</a></p>
      <hr />
      <a href="${keys.BASE_URL}">Phone store</a>
    `
  }
}