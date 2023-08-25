const express = require('express');

const { usersStorage } = require('../storage');
const { authMiddleware } = require('../middlewares');

const usersRouter = express.Router();

// Create
usersRouter.post('/', (req, res) => {
  try {
    res.status(201).json({
      status: 'ok',
      data: usersStorage.create(req.body),
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Read
usersRouter.get('/', (req, res) => {
  try {
    let users;
    const { email } = req.query;

    if (email) {
      const user = usersStorage.findByEmail(email);

      users = [user];
    } else {
      users = usersStorage.findAll();
    }

    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    res.setHeader('x-api-version', 'v1');

    res.status(200).json({
      status: 'ok',
      data: usersWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Update
usersRouter.put('/:userId', [authMiddleware], (req, res) => {
  try {
    const { userId } = req.params;

    res.status(200).json({
      status: 'ok',
      data: usersStorage.updateById(userId, req.body),
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Delete
usersRouter.delete('/:userId', [authMiddleware], (req, res) => {
  try {
    const { userId } = req.params;

    usersStorage.deleteById(userId);

    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

module.exports = {
  usersRouter,
};
