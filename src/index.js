const path = require('node:path');
const express = require('express');
const log4js = require('log4js');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const { usersRouter } = require('./users');
const { authRouter } = require('./auth');

const file = fs.readFileSync(path.resolve('./src/swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

const app = express();
const port = 3000;

const log = log4js.getLogger('main');

log.level = 'debug';

app.disable('x-powered-by');

const options = {
  explorer: true,
};

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(port, () => {
  log.debug(`Server is up and running on port ${port}!`);
});
