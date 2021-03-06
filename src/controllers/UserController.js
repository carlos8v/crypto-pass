const db = require('../database/connection');
const crypto = require('crypto');
const jwt = require('../config/jwt');

const { resolve } = require('path');
const createSendMailService = require('../services/SendEmailService');

module.exports = {
  async index(req, res) {
    const users = await db.select().table('users')
      .orderBy('username', 'asc');
    const safeUsers = users.reduce((acc, curr) => {
      const { password, created_at, email, ...safeUser } = curr;
      return [...acc, safeUser];
    }, []);
    return res.status(200).json(safeUsers);
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
    res.cookie('jid', jwt.signRefresh({ user: user.user_id }), {
      httpOnly: true,
    });

    const { password: pass, created_at, ...safeUser } = user;
    return res.status(200).json({ ...safeUser, token });
  },
  async create(req, res) {
    const { username, email } = req.body;

    const trx = await db.transaction();

    try {
      const timestamp = Date.now();
      const cryptoPassword = crypto
        .createHash('md5')
        .update(username + timestamp)
        .digest('hex');

      await trx('users').insert({
        username,
        password: cryptoPassword,
        email,
        created_at: timestamp,
      });
      
      const newAccountPath = resolve(__dirname, '..', 'views', 'emails', 'newAccount.hbs');
  
      await createSendMailService().send(
        email,
        'crypto-pass subscription',
        newAccountPath,
        {
          username,
          password: cryptoPassword,
        }
      );

      await trx.commit();

      const [ { password, created_at, ...createdUser } ] = await db.select().table('users')
        .where({ username });

      const token = jwt.sign({ user: createdUser.user_id });
      res.cookie('jid', jwt.signRefresh({ user: createdUser.user_id }), {
        httpOnly: true,
      });

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

    const [ user ] = await db.select().table('users').where({ username }).limit(1);

    if (!user)
      return res.status(401).json({ error: 'User not found'});

    const trx = await db.transaction();

    try {
      const password = crypto
        .createHash('md5')
        .update(username + user.created_at)
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
};
