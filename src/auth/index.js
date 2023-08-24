const express = require('express');
const jwt = require('jsonwebtoken');

const { usersStorage } = require('../storage');
const { JWT_PASSWORD } = require('../constants');

const authRouter = express.Router();

// Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const user = usersStorage.findByEmail(email);

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
