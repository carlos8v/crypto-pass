const db = require('../database/connection');
const crypto = require('crypto');

module.exports = {
  async index(req, res) {
    const passwords = await db.select().table('passwords')
      .orderBy('created_at', 'desc');
    return res.status(200).json(passwords);
  },
  async create(req, res) {
    const { service, password } = req.body;

    const lastPasswords = await db.select().table('passwords');

    const trx = await db.transaction();

    try {
      const cryptoPassword = crypto
        .createHash('md5')
        .update(password + lastPasswords + Date.now())
        .digest('hex');

      await trx('passwords').insert({
        service,
        password: cryptoPassword,
      });
      
      await trx.commit();

      const [ createdPass ] = await db.select().table('passwords').orderBy('created_at', 'desc');

      return res.status(201).json(createdPass);
    } catch (e) {
      trx.rollback();
      res.status(400).json({
        msg: 'Unexpected error while creating new password',
        error: e,
      });
    }
  },
};