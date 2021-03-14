require('dotenv').config();
const { warn, log } = require('./cli');

const { resolve } = require('path');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/css', express.static(resolve(__dirname, '..', 'public', 'css')));
app.use('/js', express.static(resolve(__dirname, '..', 'public', 'js')));

app.use(require('./routes'));

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  warn('initializing server');
  log(`server initialized at port ${port}`);
});
