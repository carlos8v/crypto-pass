const db = require('../database/connection');
const jwt = require('../jwt');

module.exports = {
  async authenticate(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header was not provided' });
    }

    const [_, token] = req.headers.authorization.split(' ');
    try {
      const payload = await jwt.verify(token);
      const [ user ] = await db.select().table('users')
        .where({ user_id: payload.user }).limit(1);

      if (!user)
        return res.status(401).json({ error: 'User not found'});

      const { password, ...safeUser } = user;
      req.auth = safeUser;
      next();
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}
