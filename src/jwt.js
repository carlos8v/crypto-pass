const jwt = require('jsonwebtoken');

module.exports = {
  sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }),
  verify: (token) => jwt.verify(token, process.env.JWT_SECRET),
}
