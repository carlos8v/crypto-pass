const db = require('../database/connection');
const jwt = require('../config/jwt');

module.exports = {
  async authenticate(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header was not provided' });
    }

    const [_, token] = req.headers.authorization.split(' ');
    try {
      const payload = jwt.verify(token);
      const [ user ] = await db.select().table('users')
        .where({ user_id: payload.user }).limit(1);

      if (!user)
        return res.status(401).json({ error: 'User not found'});

      const { password, created_at, ...safeUser } = user;
      req.auth = safeUser;
      next();
    } catch (error) {
      return res.status(401).json(error);
    }
  },
  async refresh(req, res) {
    const refreshToken = req.cookies?.jid;
    if (!refreshToken)
      return res.status(401).json({ error: 'User has not been authorized' });

    try {
      const payload = jwt.verifyRefresh(refreshToken);
      const [ user ] = await db.select().table('users')
        .where({ user_id: payload.user }).limit(1);

      if (!user)
        return res.status(401).json({ error: 'User not found'});

      const token = jwt.sign({ user: user.user_id });
      res.cookie('jid', jwt.signRefresh({ user: user.user_id }), {
        httpOnly: true,
      });
      
      return res.json({ token });
    } catch (error) {
      return res.status(401).json(error);
    }
  },
};
