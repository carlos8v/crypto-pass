const db = require('../database/connection');
const crypto = require('crypto');
const jwt = require('../jwt');

const { resolve } = require('path');
const createSendMailService = require('../services/SendEmailService');

module.exports = {
  async index(req, res) {
    const users = await db.select().table('users')
      .orderBy('username', 'asc');
    return res.status(200).json(users);
  },
  async get(req, res) {
    const [ _, hash ] = req.headers.authorization.split(' ');
    const [ username, password ] = Buffer.from(hash, 'base64')
      .toString().split(':');

    const [ user ] = await db.select().table('users')
      .where({ username, password }).limit(1);
    
    if(!user)
      return res.status(401).json({ error: 'Username or password does not match' });
    
    const token = jwt.sign({ user: user.user_id });
    const { password: pass, ...safeUser } = user;
    return res.status(200).json({ ...safeUser, token });
  },
  async create(req, res) {
    const { username, email } = req.body;

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
      
      const newAccountPath = resolve(__dirname, '..', 'views', 'emails', 'newAccount.hbs');
  
      await createSendMailService().send(
        email,
        'Inscrição em crypto-pass',
        newAccountPath,
        {
          username,
          password: cryptoPassword,
        }
      );

      await trx.commit();

      const [ { password, ...createdUser } ] = await db.select().table('users')
        .where({ username });

      const token = jwt.sign({ user: createdUser.user_id });

      return res.status(201).json({ ...createdUser, token });
    } catch (error) {
      trx.rollback();
      res.status(400).json({
        msg: 'Unexpected error while creating new user',
        error,
      });
    }
  },
  async destroy(req, res) {
    const { username } = req.body;
    const { user_id } = req.auth;

    const trx = await db.transaction();

    try {
      const password = crypto
        .createHash('md5')
        .update(username)
        .digest('hex');

      await trx('users').where({ user_id, password }).del();

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
