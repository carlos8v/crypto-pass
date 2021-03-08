const express = require('express');
const routes = express.Router();

const PasswordController = require('./controllers/PasswordController');
const UserController = require('./controllers/UserController');

routes.get('/users', UserController.index);
routes.post('/users/new', UserController.create);
routes.delete('/users/:userID', UserController.destroy);

routes.get('/passwords', PasswordController.index);
routes.post('/passwords/new', PasswordController.create);
routes.delete('/passwords/:passwordID', PasswordController.destroy);

module.exports = routes;
