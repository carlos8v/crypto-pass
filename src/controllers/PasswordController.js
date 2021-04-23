const db = require('../database/connection');
const crypto = require('crypto');

module.exports = {
  async index(req, res) {
    const { user_id } = req.auth;
    const passwords = await db.select().table('passwords')
      .where({ user_id })
      .orderBy('created_at', 'desc');
    return res.status(200).json(passwords);
  },
  async create(req, res) {
    const { service } = req.body;
    const { user_id } = req.auth;

    const lastPasswords = await db.select().table('passwords');

    const trx = await db.transaction();

    try {
      const cryptoPassword = crypto
        .createHash('md5')
        .update(JSON.stringify(lastPasswords) + Date.now())
        .digest('hex');

      await trx('passwords').insert({
        service,
        password: cryptoPassword,
        user_id,
      });
      
      await trx.commit();

      const [ createdPass ] = await db.select().table('passwords').orderBy('created_at', 'desc');

      return res.status(201).json(createdPass);
    } catch (error) {
      trx.rollback();
      res.status(400).json({
        msg: 'Unexpected error while creating new password',
        error,
      });
    }
  },
  async destroy(req, res) {
    const { passwordID: password_id } = req.params;

    const trx = await db.transaction();

    try {
      await trx('passwords').where({ password_id }).del();

      await trx.commit();

      return res.status(200).send();

    } catch (error) {
      trx.rollback();
      res.status(400).json({
        msg: 'Unexpected error while deleting password',
        error,
      });
    }
  }
};
