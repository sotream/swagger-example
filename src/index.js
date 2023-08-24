const express = require('express');
const log4js = require('log4js');

const { usersRouter } = require('./users');
const { authRouter } = require('./auth');

const app = express();
const port = 3000;

const log = log4js.getLogger('main');

log.level = 'debug';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);

app.listen(port, () => {
  log.debug(`Server is up and running on port ${port}!`);
});
