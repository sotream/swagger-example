const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');

const { usersRouter } = require('./routers/users');
const { authRouter } = require('./routers/auth');

const app = express();

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c -%] %m',
      },
    },
  },
  categories: { default: { appenders: ['out'], level: 'debug' } },
});

const log = log4js.getLogger('server');

log.level = 'debug';

app.disable('x-powered-by');

app.use(
  bodyParser.json({
    limit: '1kb',
  }),
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);

module.exports = {
  app,
};
