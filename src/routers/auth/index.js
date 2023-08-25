const express = require('express');
const jwt = require('jsonwebtoken');

const { usersStorage } = require('../../store/users');
const { JWT_PASSWORD } = require('../../common/constants');

const authRouter = express.Router();

// Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('req.body', req.body);
    if (!email) {
      throw new Error('Wrong credentials');
    }

    const user = usersStorage.findByFilter(email);
    console.log('user', user);

    if (user.password !== password) {
      throw new Error('Wrong credentials');
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
    res.status(401).json({
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
