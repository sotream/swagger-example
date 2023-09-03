const path = require('node:path');
const fs = require('node:fs');
const log4js = require('log4js');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const { app } = require('./server');

const log = log4js.getLogger('server');

log.level = 'debug';

const port = parseInt(process.env.PORT) || 3000;
const file = fs.readFileSync(path.resolve('./src/docs/swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

const options = {
  explorer: false,
  //   customCssUrl: '/static/css/theme-material.css',
  //   customCssUrl: '/static/css/theme-flattop.css',
};

swaggerDocument.info.version = process.env.npm_package_version;

app.use(express.static(__dirname));
app.use(express.static('public'));

app.use('*.css', (req, res, next) => {
  res.set('Content-Type', 'text/css');
  next();
});

app.use('/docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(port, () => {
  log.debug(`Server is up and running on port ${port}!`);
});
