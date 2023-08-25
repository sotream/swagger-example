const express = require('express');

const { usersStorage } = require('../../store/users');
const { authMiddleware } = require('../../middlewares/auth');

const usersRouter = express.Router();

// Create
usersRouter.post('/', (req, res) => {
  try {
    res.setHeader('x-api-version', 'v1');

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
    const { filter } = req.query;

    if (filter) {
      users = usersStorage.findByFilter(filter);
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

// Read by id
usersRouter.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const user = usersStorage.findById(userId);

    res.setHeader('x-api-version', 'v1');

    res.status(200).json({
      status: 'ok',
      data: user,
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

    res.setHeader('x-api-version', 'v1');

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

    res.setHeader('x-api-version', 'v1');

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