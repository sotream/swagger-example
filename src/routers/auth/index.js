const express = require('express');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');

const { NotAuthorizedError } = require('../../common/errors');
const { usersStorage } = require('../../store/users');
const { JWT_PASSWORD } = require('../../common/constants');

const authRouter = express.Router();

const log = log4js.getLogger('authRouter');

log.level = 'debug';

// Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    log.debug('Login request body=', req.body);

    if (!email) {
      throw new NotAuthorizedError('Wrong credentials');
    }

    const users = usersStorage.findByFilter(email, true);

    log.debug('Stored users=', users);

    if (users.length !== 1) {
      throw new NotAuthorizedError('Wrong credentials');
    }

    const [user] = users;

    if (user.password !== password) {
      throw new NotAuthorizedError('Wrong credentials');
    }

    const accessToken = jwt.sign({ email: user.email }, JWT_PASSWORD, {
      algorithm: 'HS512',
      expiresIn: '1h',
    });

    res.status(200).json({
      status: 'ok',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(error.code || 401).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

module.exports = {
  authRouter,
};
