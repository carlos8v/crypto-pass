const express = require('express');
const routes = express.Router();

const PasswordController = require('./controllers/PasswordController');

routes.get('/passwords', PasswordController.index);
routes.post('/password/new', PasswordController.create);

module.exports = routes;