const { resolve } = require('path');
const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const PasswordController = require('./controllers/PasswordController');

routes.post('/refresh_token', AuthController.refresh);
routes.get('/me', AuthController.authenticate, (req, res) => {
  res.status(200).json(req.auth);
});

routes.get('/users', UserController.index);
routes.get('/users/find', UserController.get);
routes.post('/users/new', UserController.create);
routes.delete('/users', AuthController.authenticate, UserController.destroy);

routes.get('/passwords', AuthController.authenticate, PasswordController.index);
routes.post('/passwords/new', AuthController.authenticate, PasswordController.create);
routes.delete('/passwords/:passwordID', AuthController.authenticate, PasswordController.destroy);

const pagesFolder = resolve(__dirname, '..', 'public', 'html');

routes.get('/', (req, res) => res.sendFile(`${pagesFolder}/login.html`));
routes.get('/home', (req, res) => res.sendFile(`${pagesFolder}/home.html`));
routes.get('/join', (req, res) => res.sendFile(`${pagesFolder}/join.html`));

module.exports = routes;
