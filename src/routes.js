const express = require('express');
const routes = express.Router();

const PasswordController = require('./controllers/PasswordController');
const UserController = require('./controllers/UserController');

routes.get('/users', UserController.index);
routes.post('/user/new', UserController.create);

routes.get('/passwords', PasswordController.index);
routes.post('/password/new', PasswordController.create);

module.exports = routes;
