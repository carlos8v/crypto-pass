const { resolve } = require('path');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/css', express.static(resolve(__dirname, '..', 'public', 'css')));
app.use('/scripts', express.static(resolve(__dirname, '..', 'public', 'scripts')));

app.use(require('./routes'));

app.listen(3000);
