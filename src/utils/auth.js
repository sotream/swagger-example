const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const { JWT_PASSWORD } = require('../common/constants');

const log = log4js.getLogger('authUtils');

log.level = 'debug';

const getAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, JWT_PASSWORD, {
    algorithm: 'HS512',
    expiresIn: '1h',
  });

  log.info('Generated accessToken for payload=', payload);

  return accessToken;
};

module.exports = {
  getAccessToken,
};
