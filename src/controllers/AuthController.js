const db = require('../database/connection');
const jwt = require('../jwt');

module.exports = {
  async authenticate(req, res, next) {
    if (!req.headers.authorization)
      return res.status(401);

    const [_, token] = req.headers.authorization.split(' ');
    try {
      const payload = await jwt.verify(token);
      const [ { password, ...user } ] = await db.select().table('users')
        .where({ user_id: payload.user }).limit(1);

      if (!user)
        return res.status(401).json({ error: 'User not found'});
      
      req.auth = user;

      next();
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}
