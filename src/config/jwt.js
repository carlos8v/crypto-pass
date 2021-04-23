const jwt = require('jsonwebtoken');

module.exports = {
  sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }),
  verify: (token) => jwt.verify(token, process.env.JWT_SECRET),
  signRefresh: (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
  verifyRefresh: (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET),
};
