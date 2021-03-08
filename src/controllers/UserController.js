const db = require('../database/connection');
const crypto = require('crypto');

module.exports = {
  async index(req, res) {
    const users = await db.select().table('users')
      .orderBy('username', 'asc');
    return res.status(200).json(users);
  },
  async create(req, res) {
    const { username } = req.body;

    const trx = await db.transaction();

    try {
      const cryptoPassword = crypto
        .createHash('md5')
        .update(username)
        .digest('hex');

      await trx('users').insert({
        username,
        password: cryptoPassword,
      });
      
      await trx.commit();

      const createdUser = await db.select().table('users')
        .where({ username });

      return res.status(201).json(createdUser);
    } catch (error) {
      trx.rollback();
      res.status(400).json({
        msg: 'Unexpected error while creating new user',
        error,
      });
    }
  },
  async destroy(req, res) {
    const { userID: user_id } = req.params;
    const { username } = req.body;

    const trx = await db.transaction();

    try {
      const password = crypto
        .createHash('md5')
        .update(username)
        .digest('hex');

      await trx('users').where({ user_id, password }).del();
      await trx('passwords').where({ user_id }).del();

      await trx.commit();

      return res.status(200).send();

    } catch (error) {
      trx.rollback();
      res.status(400).json({
        msg: 'Unexpected error while deleting user',
        error,
      });
    }
  }
}
