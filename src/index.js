const path = require('node:path');
const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const { usersRouter } = require('./routers/users');
const { authRouter } = require('./routers/auth');

const file = fs.readFileSync(path.resolve('./src/docs/swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

const app = express();
const port = 3000;

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

const log = log4js.getLogger('main');

log.level = 'debug';

app.disable('x-powered-by');

const options = {
  explorer: false,
};

app.use(
  bodyParser.json({
    limit: '1kb',
  }),
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(port, () => {
  log.debug(`Server is up and running on port ${port}!`);
});
